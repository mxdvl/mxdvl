/**
 * Approximate UK postcode sector & district boundaries from open data.
 *
 * Method — “OA-constrained Voronoi”:
 *   1. Every live NSPL postcode has a centroid and an Output Area (OA) code.
 *   2. An OA whose postcodes all sit in one sector goes to that sector whole.
 *   3. An OA split between sectors is divided by a Voronoi diagram of its
 *      postcode centroids, clipped to the OA.
 *   4. OAs with no usable postcode join the neighbouring sector they share
 *      the longest edge with.
 *   5. Pieces are dissolved into sectors, simplified as a coverage (no seams),
 *      and sectors are dissolved into districts, so the two levels nest.
 *
 * OA boundaries are clipped to the coastline and follow real features, so the
 * result inherits those edges for free.
 *
 * The pipeline is plain SQL run by DuckDB in three stages, each usable alone:
 *   loadInputs        files → `postcodes` and `output_areas` tables
 *   computeBoundaries tables → `sectors`, `districts` and `oa_lookup` tables
 *   writeOutputs      tables → GeoJSON and CSV files
 */

import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";
import { mkdir } from "node:fs/promises";

export type BoundarySource = {
	/** Any file GDAL can read: Shapefile, GeoPackage, File Geodatabase… */
	path: string;
	/** Column holding the OA / Data Zone code that matches the NSPL’s OA field */
	codeColumn: string;
	/** CRS of the file. Defaults to British National Grid. */
	crs?: string;
};

export type Inputs = {
	/** Path (or glob) to the NSPL CSV */
	nspl: string;
	/** Output Area–level boundary files */
	outputAreas: readonly BoundarySource[];
	/** Large-user postcodes often sit on the delivery office, so are off by default */
	includeLargeUsers?: boolean;
	/** NSPL grid reference quality: 1 is best, 6 is a sector mean, 9 is none */
	worstGridQuality?: number;
};

export type Settings = {
	/** Postcode areas to build, e.g. ["E"]. Empty means the whole UK. */
	areas?: readonly string[];
	/** Coverage simplification tolerance in metres. 0 keeps full detail. */
	simplifyTolerance?: number;
	log?: (message: string) => void;
};

export type Options = Inputs & Settings & {
	outDir?: string;
	/** DuckDB database file. Use a path to inspect intermediate tables afterwards. */
	database?: string;
};

const BRITISH_NATIONAL_GRID = "EPSG:27700";
/** NSPL gives Northern Irish (BT) postcodes in Irish Grid */
const IRISH_GRID = "EPSG:29903";
const WGS84 = "EPSG:4326";

/** SQL string literal */
export const literal = (value: string): string => `'${value.replaceAll("'", "''")}'`;

/** SQL identifier */
const identifier = (name: string): string => `"${name.replaceAll('"', '""')}"`;

const list = (values: readonly string[]): string => values.map(literal).join(", ");

// ---------------------------------------------------------------------------
// DuckDB helpers

export async function connect(database = ":memory:"): Promise<{ connection: DuckDBConnection; close: () => void }> {
	const instance = await DuckDBInstance.create(database);
	const connection = await instance.connect();
	await connection.run("INSTALL spatial; LOAD spatial;");

	const close = () => {
		connection.closeSync();
		instance.closeSync();
	};

	return { connection, close };
}

export async function rows(connection: DuckDBConnection, sql: string): Promise<Record<string, unknown>[]> {
	const reader = await connection.runAndReadAll(sql);
	return reader.getRowObjectsJson() as Record<string, unknown>[];
}

async function count(connection: DuckDBConnection, table: string): Promise<number> {
	const [row] = await rows(connection, `SELECT count(*) AS n FROM ${table}`);
	return Number(row?.n ?? 0);
}

function stepRunner(connection: DuckDBConnection, log: (message: string) => void) {
	return async (name: string, sql: string): Promise<void> => {
		const start = performance.now();
		await connection.run(sql);
		const seconds = ((performance.now() - start) / 1000).toFixed(1);
		log(`✓ ${name} (${seconds}s)`);
	};
}

// ---------------------------------------------------------------------------
// Stage 1: inputs

/** NSPL columns changed name in 2025 (e.g. oseast1m → EAST1M). Support both. */
type NsplColumns = {
	postcode: string;
	terminated: string;
	userType: string;
	east: string;
	north: string;
	gridQuality: string;
	outputArea: string;
	region: string;
};

async function nsplColumns(connection: DuckDBConnection, nspl: string): Promise<NsplColumns> {
	const described = await rows(
		connection,
		`DESCRIBE SELECT * FROM read_csv(${literal(nspl)}, all_varchar = true, normalize_names = true)`,
	);
	const names = described.map((row) => String(row.column_name));

	const pick = (...candidates: string[]): string => {
		const found = candidates.find((candidate) => names.includes(candidate));
		if (!found) throw new Error(`NSPL has none of: ${candidates.join(", ")}`);
		return found;
	};

	// the region column carries its vintage, e.g. rgn25cd
	const region = names.find((name) => /^rgn(\d\dcd)?$/.test(name));
	if (!region) throw new Error("NSPL has no region (rgn…) column");

	return {
		region,
		postcode: pick("pcds"),
		terminated: pick("doterm"),
		userType: pick("usrtypind", "usertype"),
		east: pick("east1m", "oseast1m"),
		north: pick("north1m", "osnrth1m"),
		gridQuality: pick("gridind", "osgrdind"),
		outputArea: pick("oa21cd", "oa21"),
	};
}

/**
 * Builds the `postcodes` table from any relation with columns
 * postcode, oa, region, x, y (British National Grid).
 */
export function derivePostcodes(relation: string): string {
	return `
CREATE OR REPLACE TABLE postcodes AS
SELECT
	postcode,
	regexp_extract(postcode, '^[A-Z]+') AS area,
	split_part(postcode, ' ', 1) AS district,
	split_part(postcode, ' ', 1) || ' ' || left(split_part(postcode, ' ', 2), 1) AS sector,
	oa,
	region,
	x::DOUBLE AS x,
	y::DOUBLE AS y
FROM ${relation}`;
}

function locateNsplPostcodes(
	nspl: string,
	columns: NsplColumns,
	{ includeLargeUsers, worstGridQuality }: { includeLargeUsers: boolean; worstGridQuality: number },
): string {
	const c = Object.fromEntries(
		Object.entries(columns).map(([key, name]) => [key, identifier(name)]),
	) as NsplColumns;

	return `
CREATE OR REPLACE TEMP VIEW nspl_postcodes AS
WITH raw AS (
	SELECT
		upper(trim(${c.postcode})) AS postcode,
		nullif(trim(${c.outputArea}), '') AS oa,
		trim(${c.region}) AS region,
		TRY_CAST(${c.east} AS DOUBLE) AS east,
		TRY_CAST(${c.north} AS DOUBLE) AS north,
		TRY_CAST(${c.gridQuality} AS INTEGER) AS grid_quality,
		trim(${c.userType}) AS user_type,
		nullif(trim(${c.terminated}), '') AS terminated
	FROM read_csv(${literal(nspl)}, all_varchar = true, normalize_names = true)
),
live AS (
	SELECT * FROM raw
	WHERE terminated IS NULL
		AND oa IS NOT NULL
		AND east IS NOT NULL AND north IS NOT NULL
		AND grid_quality BETWEEN 1 AND ${worstGridQuality}
		${includeLargeUsers ? "" : "AND user_type = '0'"}
),
located AS (
	SELECT *,
		CASE WHEN postcode LIKE 'BT%'
			THEN ST_Transform(ST_Point(east, north), ${literal(IRISH_GRID)}, ${literal(BRITISH_NATIONAL_GRID)}, true)
			ELSE ST_Point(east, north)
		END AS geom
	FROM live
)
SELECT postcode, oa, region, ST_X(geom) AS x, ST_Y(geom) AS y
FROM located`;
}

function loadOutputAreas(sources: readonly BoundarySource[]): string {
	const selects = sources.map(({ path, codeColumn, crs = BRITISH_NATIONAL_GRID }) => {
		const geom = crs === BRITISH_NATIONAL_GRID
			? "geom"
			: `ST_Transform(geom, ${literal(crs)}, ${literal(BRITISH_NATIONAL_GRID)}, true)`;
		return `SELECT ${identifier(codeColumn)}::VARCHAR AS oa, ST_MakeValid(${geom})::GEOMETRY AS geom
	FROM ST_Read(${literal(path)})`;
	});

	return `CREATE OR REPLACE TABLE output_areas AS\n${selects.join("\nUNION ALL\n")}`;
}

export async function loadInputs(
	connection: DuckDBConnection,
	{ nspl, outputAreas, includeLargeUsers = false, worstGridQuality = 5 }: Inputs,
	log: (message: string) => void = console.log,
): Promise<void> {
	const step = stepRunner(connection, log);

	const columns = await nsplColumns(connection, nspl);
	await step("locate NSPL postcodes", locateNsplPostcodes(nspl, columns, { includeLargeUsers, worstGridQuality }));
	await step("postcodes", derivePostcodes("nspl_postcodes"));
	await step("output areas", loadOutputAreas(outputAreas));

	const unmatched = await rows(
		connection,
		`SELECT left(oa, 1) AS country, count(*) AS postcodes
		FROM postcodes WHERE oa NOT IN (SELECT oa FROM output_areas)
		GROUP BY 1 ORDER BY 1`,
	);
	for (const { country, postcodes } of unmatched) {
		log(`⚠ ${postcodes} postcodes with OA codes starting “${country}” have no boundary`);
	}
}

// ---------------------------------------------------------------------------
// Stage 2: boundaries

/** Which OAs take part. For an area run: OAs holding its postcodes, plus nearby empty OAs. */
function defineScope(areas: readonly string[]): string[] {
	if (areas.length === 0) {
		return [`CREATE OR REPLACE TABLE scope AS SELECT oa FROM output_areas`];
	}

	return [
		`CREATE OR REPLACE TABLE scope AS
SELECT DISTINCT oa FROM postcodes WHERE area IN (${list(areas)})`,
		`INSERT INTO scope
SELECT o.oa
FROM output_areas o, (
	SELECT ST_MakeEnvelope(min(ST_XMin(geom)), min(ST_YMin(geom)), max(ST_XMax(geom)), max(ST_YMax(geom))) AS box
	FROM output_areas WHERE oa IN (SELECT oa FROM scope)
) extent
WHERE o.oa NOT IN (SELECT oa FROM postcodes)
	AND ST_Intersects(o.geom, extent.box)`,
	];
}

/**
 * One site per distinct location in an OA. Postcodes sharing a centroid vote.
 * All postcodes in a scoped OA count, whatever their area, so edges are right.
 */
const buildSites = `
CREATE OR REPLACE TABLE sites AS
SELECT oa, x, y, mode(sector) AS sector, count(*) AS postcodes
FROM postcodes
WHERE oa IN (SELECT oa FROM scope)
GROUP BY oa, x, y`;

const classifyOutputAreas = `
CREATE OR REPLACE TABLE oa_status AS
SELECT oa, count(DISTINCT sector) AS sectors, any_value(sector) AS sector
FROM sites
GROUP BY oa`;

/** Dominant sector and district of each OA, and the share of its postcodes in them */
const buildLookup = `
CREATE OR REPLACE TABLE oa_lookup AS
WITH by_sector AS (
	SELECT oa, sector, split_part(sector, ' ', 1) AS district, count(*) AS n
	FROM postcodes
	WHERE oa IN (SELECT oa FROM scope)
	GROUP BY ALL
),
sectors AS (
	SELECT oa, sum(n) AS postcodes, arg_max(sector, n) AS sector, max(n) / sum(n) AS sector_share
	FROM by_sector
	GROUP BY oa
),
by_district AS (
	SELECT oa, district, sum(n) AS n FROM by_sector GROUP BY ALL
),
districts AS (
	SELECT oa, arg_max(district, n) AS district, max(n) / sum(n) AS district_share
	FROM by_district
	GROUP BY oa
)
SELECT oa, postcodes, sector, sector_share, district, district_share
FROM sectors
JOIN districts USING (oa)`;

const wholeOutputAreas = `
CREATE OR REPLACE TABLE pieces AS
SELECT o.oa, s.sector, o.geom
FROM output_areas o
JOIN oa_status s USING (oa)
WHERE s.sectors = 1`;

const splitOutputAreas = `
INSERT INTO pieces
WITH split AS (
	SELECT oa, ST_Collect(list(ST_Point(x, y))) AS points
	FROM sites
	WHERE oa IN (SELECT oa FROM oa_status WHERE sectors > 1)
	GROUP BY oa
),
cells AS (
	SELECT oa, unnest(ST_Dump(ST_VoronoiDiagram(points)), recursive := true)
	FROM split
)
SELECT c.oa, s.sector, ST_CollectionExtract(ST_Intersection(c.geom, o.geom), 3) AS geom
FROM cells c
JOIN output_areas o ON o.oa = c.oa
JOIN sites s ON s.oa = c.oa AND ST_Intersects(c.geom, ST_Point(s.x, s.y))`;

/**
 * GEOS clips a Voronoi diagram to a box around its points, so a large OA with
 * clustered postcodes can be left partly uncovered. Give leftovers to the
 * nearest site.
 */
const fillVoronoiGaps = `
INSERT INTO pieces
WITH covered AS (
	SELECT oa, ST_Union_Agg(geom) AS geom
	FROM pieces
	WHERE oa IN (SELECT oa FROM oa_status WHERE sectors > 1)
	GROUP BY oa
),
gaps AS (
	SELECT oa, row_number() OVER () AS id, geom
	FROM (
		SELECT c.oa, unnest(ST_Dump(ST_CollectionExtract(ST_Difference(o.geom, c.geom), 3)), recursive := true)
		FROM covered c
		JOIN output_areas o USING (oa)
	)
	WHERE ST_Area(geom) > 1
)
SELECT
	any_value(g.oa),
	arg_min(s.sector, ST_Distance(g.geom, ST_Point(s.x, s.y))),
	any_value(g.geom)
FROM gaps g
JOIN sites s ON s.oa = g.oa
GROUP BY g.id`;

/** Run repeatedly: an empty OA surrounded by empty OAs is filled on a later pass. */
const assignEmptyOutputAreas = `
INSERT INTO pieces
WITH empty AS (
	SELECT oa, geom FROM output_areas
	WHERE oa IN (SELECT oa FROM scope)
		AND oa NOT IN (SELECT oa FROM pieces)
),
shared AS (
	SELECT e.oa, p.sector, sum(ST_Length(ST_Intersection(ST_Boundary(e.geom), p.geom))) AS length
	FROM empty e
	JOIN pieces p ON ST_Intersects(e.geom, p.geom)
	GROUP BY e.oa, p.sector
)
SELECT s.oa, arg_max(s.sector, s.length), any_value(e.geom)
FROM shared s
JOIN empty e USING (oa)
WHERE s.length > 0
GROUP BY s.oa`;

function dissolveSectors(areas: readonly string[]): string {
	const filter = areas.length === 0 ? "" : `WHERE regexp_extract(p.sector, '^[A-Z]+') IN (${list(areas)})`;
	return `
CREATE OR REPLACE TABLE sectors_raw AS
WITH counts AS (SELECT sector, count(*) AS postcodes FROM postcodes GROUP BY sector)
SELECT
	p.sector,
	split_part(p.sector, ' ', 1) AS district,
	regexp_extract(p.sector, '^[A-Z]+') AS area,
	coalesce(any_value(c.postcodes), 0) AS postcodes,
	ST_Union_Agg(p.geom) AS geom
FROM pieces p
LEFT JOIN counts c USING (sector)
${filter}
GROUP BY p.sector`;
}

/** Simplify all sectors together so neighbours keep identical shared edges. */
function simplifySectors(tolerance: number): string {
	if (tolerance <= 0) return `CREATE OR REPLACE TABLE sectors AS SELECT * FROM sectors_raw`;

	return `
CREATE OR REPLACE TABLE sectors AS
WITH coverage AS (
	SELECT list(sector ORDER BY sector) AS names, list(geom ORDER BY sector) AS geoms
	FROM sectors_raw
),
parts AS (
	SELECT names, unnest(ST_Dump(ST_CoverageSimplify(geoms, ${tolerance})), recursive := true)
	FROM coverage
),
indexed AS (
	-- position of each part in the input list, whatever base ST_Dump counts from
	SELECT names[path[1] - min(path[1]) OVER () + 1] AS sector, geom
	FROM parts
)
SELECT r.sector, r.district, r.area, r.postcodes, ST_Union_Agg(i.geom) AS geom
FROM indexed i
JOIN sectors_raw r USING (sector)
GROUP BY ALL`;
}

const dissolveDistricts = `
CREATE OR REPLACE TABLE districts AS
SELECT district, area, sum(postcodes) AS postcodes, count(*) AS sectors, ST_Union_Agg(geom) AS geom
FROM sectors
GROUP BY district, area`;

/** Needs `postcodes` and `output_areas` tables; creates `sectors`, `districts` and `oa_lookup`. */
export async function computeBoundaries(
	connection: DuckDBConnection,
	{ areas = [], simplifyTolerance = 10, log = console.log }: Settings = {},
): Promise<void> {
	const step = stepRunner(connection, log);

	for (const [index, sql] of defineScope(areas).entries()) {
		await step(`scope ${index + 1}`, sql);
	}
	await step("sites", buildSites);
	await step("classify OAs", classifyOutputAreas);
	await step("OA lookup", buildLookup);
	await step("whole OAs", wholeOutputAreas);
	await step("split OAs (Voronoi)", splitOutputAreas);
	await step("fill Voronoi gaps", fillVoronoiGaps);

	for (let pass = 1; pass <= 10; pass++) {
		const before = await count(connection, "pieces");
		await step(`empty OAs, pass ${pass}`, assignEmptyOutputAreas);
		if ((await count(connection, "pieces")) === before) break;
	}

	await step("dissolve sectors", dissolveSectors(areas));
	await step("simplify sectors", simplifySectors(simplifyTolerance));
	await step("dissolve districts", dissolveDistricts);
}

// ---------------------------------------------------------------------------
// Stage 3: outputs

function writeGeoJson(table: string, orderBy: string, path: string): string {
	return `
COPY (
	SELECT * EXCLUDE (geom), ST_Transform(geom, ${literal(BRITISH_NATIONAL_GRID)}, ${literal(WGS84)}, true) AS geom
	FROM ${table}
	ORDER BY ${orderBy}
) TO ${literal(path)} WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_CREATION_OPTIONS 'COORDINATE_PRECISION=6')`;
}

export async function writeOutputs(
	connection: DuckDBConnection,
	outDir: string,
	log: (message: string) => void = console.log,
): Promise<void> {
	const step = stepRunner(connection, log);
	await mkdir(outDir, { recursive: true });

	await step("write sectors", writeGeoJson("sectors", "sector", `${outDir}/sectors.geojson`));
	await step("write districts", writeGeoJson("districts", "district", `${outDir}/districts.geojson`));
	await step(
		"write OA lookup",
		`COPY (SELECT * FROM oa_lookup ORDER BY oa) TO ${literal(`${outDir}/oa-lookup.csv`)} (HEADER)`,
	);
}

// ---------------------------------------------------------------------------

export async function buildPostcodeBoundaries(options: Options): Promise<void> {
	const { outDir = "out", database = ":memory:", log = console.log } = options;
	const { connection, close } = await connect(database);

	try {
		await loadInputs(connection, options, log);
		await computeBoundaries(connection, options);
		await writeOutputs(connection, outDir, log);

		const [summary] = await rows(
			connection,
			`SELECT
				(SELECT count(*) FROM postcodes) AS postcodes,
				(SELECT count(*) FROM scope) AS output_areas,
				(SELECT count(*) FROM oa_status WHERE sectors > 1) AS split_output_areas,
				(SELECT count(*) FROM scope WHERE oa NOT IN (SELECT oa FROM pieces)) AS unassigned_output_areas,
				(SELECT count(*) FROM sectors) AS sectors,
				(SELECT count(*) FROM districts) AS districts`,
		);
		console.table(summary);
	} finally {
		close();
	}
}
