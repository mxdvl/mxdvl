/**
 * Approximate postcode sector & district boundaries for England and Wales,
 * from open data only: the NSPL and census Output Area (OA) boundaries.
 *
 * Method — “OA-constrained Voronoi”:
 *   1. Every live NSPL postcode has a centroid and an OA code.
 *   2. An OA whose postcodes all sit in one sector goes to that sector whole.
 *   3. An OA split between sectors is divided by a Voronoi diagram of its
 *      postcode centroids, clipped to the OA.
 *   4. OAs with no usable postcode join the neighbouring sector they share
 *      the longest edge with.
 *   5. Pieces are dissolved into sectors, and sectors into districts.
 *
 * OA boundaries are clipped to the coastline and follow real features, so the
 * result inherits those edges for free.
 *
 * Three stages, each plain SQL run by DuckDB:
 *   loadInputs        files  → `postcodes`, `output_areas`
 *   computeBoundaries tables → `sectors`, `districts`, `oa_lookup`
 *   writeOutputs      tables → GeoJSON and CSV files
 */

import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";
import { mkdir } from "node:fs/promises";

type Log = (message: string) => void;

export type Options = {
	/** NSPL CSV (2025 column names or later) */
	nspl: string;
	/** Output Areas (December 2021) Boundaries EW BGC — a Shapefile in British National Grid */
	outputAreas: string;
	/** Postcode areas to build, e.g. ["E"]. Empty means all of England and Wales. */
	areas?: readonly string[];
	/** Large-user postcodes often sit on the delivery office, so are off by default */
	includeLargeUsers?: boolean;
	outDir?: string;
	/** DuckDB database file. Use a path to inspect intermediate tables afterwards. */
	database?: string;
	log?: Log;
};

/** SQL string literal */
export const literal = (value: string): string => `'${value.replaceAll("'", "''")}'`;

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

function stepRunner(connection: DuckDBConnection, log: Log) {
	return async (name: string, sql: string): Promise<void> => {
		const start = performance.now();
		await connection.run(sql);
		log(`✓ ${name} (${((performance.now() - start) / 1000).toFixed(1)}s)`);
	};
}

// ---------------------------------------------------------------------------
// Stage 1: inputs

/** Builds `postcodes` from any relation with columns postcode, oa, x, y (British National Grid). */
export function derivePostcodes(relation: string): string {
	return `
CREATE OR REPLACE TABLE postcodes AS
SELECT
	postcode,
	regexp_extract(postcode, '^[A-Z]+') AS area,
	split_part(postcode, ' ', 1) AS district,
	split_part(postcode, ' ', 1) || ' ' || left(split_part(postcode, ' ', 2), 1) AS sector,
	oa,
	x::DOUBLE AS x,
	y::DOUBLE AS y
FROM ${relation}`;
}

/**
 * Live, small-user postcodes in England and Wales with a good grid reference.
 * Grid quality runs from 1 (best) to 9 (none); 6 is a sector mean.
 */
function nsplPostcodes(nspl: string, includeLargeUsers: boolean): string {
	return `
CREATE OR REPLACE TEMP VIEW nspl_postcodes AS
SELECT pcds AS postcode, oa21cd AS oa, east1m AS x, north1m AS y
FROM read_csv(${literal(nspl)}, normalize_names = true)
WHERE doterm IS NULL
	AND (oa21cd LIKE 'E00%' OR oa21cd LIKE 'W00%')
	AND east1m IS NOT NULL
	AND gridind BETWEEN 1 AND 5
	${includeLargeUsers ? "" : "AND usrtypind = 0"}`;
}

const outputAreasFrom = (path: string): string => `
CREATE OR REPLACE TABLE output_areas AS
SELECT OA21CD AS oa, ST_MakeValid(geom) AS geom
FROM ST_Read(${literal(path)})`;

export async function loadInputs(
	connection: DuckDBConnection,
	{ nspl, outputAreas, includeLargeUsers = false, log = console.log }: Options,
): Promise<void> {
	const step = stepRunner(connection, log);
	await step("NSPL", nsplPostcodes(nspl, includeLargeUsers));
	await step("postcodes", derivePostcodes("nspl_postcodes"));
	await step("output areas", outputAreasFrom(outputAreas));
}

// ---------------------------------------------------------------------------
// Stage 2: boundaries

/**
 * Which OAs take part. For an area run: the OAs holding its postcodes, plus
 * empty OAs nearby so they can be assigned.
 */
function scope(areas: readonly string[]): string {
	if (areas.length === 0) return `CREATE OR REPLACE TABLE scope AS SELECT oa FROM output_areas`;

	return `
CREATE OR REPLACE TABLE scope AS
WITH holding AS (
	SELECT DISTINCT oa FROM postcodes WHERE area IN (${list(areas)})
),
extent AS (
	SELECT ST_MakeEnvelope(min(ST_XMin(geom)), min(ST_YMin(geom)), max(ST_XMax(geom)), max(ST_YMax(geom))) AS box
	FROM output_areas WHERE oa IN (SELECT oa FROM holding)
)
SELECT oa FROM holding
UNION
SELECT o.oa FROM output_areas o, extent
WHERE o.oa NOT IN (SELECT oa FROM postcodes) AND ST_Intersects(o.geom, extent.box)`;
}

/**
 * One site per distinct location in an OA; postcodes sharing a centroid vote.
 * All postcodes in a scoped OA count, whatever their area, so edges are right.
 */
const sites = `
CREATE OR REPLACE TABLE sites AS
SELECT oa, x, y, mode(sector) AS sector
FROM postcodes
WHERE oa IN (SELECT oa FROM scope)
GROUP BY oa, x, y`;

const sectorsPerOutputArea = `
CREATE OR REPLACE TABLE oa_sectors AS
SELECT oa, count(DISTINCT sector) AS sectors, any_value(sector) AS sector
FROM sites
GROUP BY oa`;

/** Dominant sector and district of each OA, and the share of its postcodes in them */
const lookup = `
CREATE OR REPLACE TABLE oa_lookup AS
WITH by_sector AS (
	SELECT oa, sector, district, count(*) AS n
	FROM postcodes
	WHERE oa IN (SELECT oa FROM scope)
	GROUP BY ALL
),
by_district AS (
	SELECT oa, district, sum(n) AS n FROM by_sector GROUP BY ALL
)
SELECT oa, postcodes, sector, sector_share, district, district_share
FROM (
	SELECT oa, sum(n) AS postcodes, arg_max(sector, n) AS sector, max(n) / sum(n) AS sector_share
	FROM by_sector GROUP BY oa
)
JOIN (
	SELECT oa, arg_max(district, n) AS district, max(n) / sum(n) AS district_share
	FROM by_district GROUP BY oa
) USING (oa)`;

const wholeOutputAreas = `
CREATE OR REPLACE TABLE pieces AS
SELECT o.oa, s.sector, o.geom
FROM output_areas o
JOIN oa_sectors s USING (oa)
WHERE s.sectors = 1`;

const splitOutputAreas = `
INSERT INTO pieces
WITH split AS (
	SELECT oa, ST_Collect(list(ST_Point(x, y))) AS points
	FROM sites
	WHERE oa IN (SELECT oa FROM oa_sectors WHERE sectors > 1)
	GROUP BY oa
),
cells AS (
	SELECT oa, unnest(ST_Dump(ST_VoronoiDiagram(points)), recursive := true)
	FROM split
)
SELECT c.oa, s.sector, ST_CollectionExtract(ST_Intersection(c.geom, o.geom), 3)
FROM cells c
JOIN output_areas o ON o.oa = c.oa
JOIN sites s ON s.oa = c.oa AND ST_Intersects(c.geom, ST_Point(s.x, s.y))`;

/**
 * GEOS clips a Voronoi diagram to a box around its points, so a large OA with
 * clustered postcodes may be left partly uncovered. Leftovers go to the
 * nearest site. If the “clustered postcodes” test passes without this step,
 * delete it.
 */
const fillVoronoiGaps = `
INSERT INTO pieces
WITH covered AS (
	SELECT oa, ST_Union_Agg(geom) AS geom
	FROM pieces
	WHERE oa IN (SELECT oa FROM oa_sectors WHERE sectors > 1)
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
SELECT any_value(g.oa), arg_min(s.sector, ST_Distance(g.geom, ST_Point(s.x, s.y))), any_value(g.geom)
FROM gaps g
JOIN sites s ON s.oa = g.oa
GROUP BY g.id`;

/** Run until nothing changes: an OA surrounded by empty OAs is filled on a later pass. */
const assignEmptyOutputAreas = `
INSERT INTO pieces
WITH empty AS (
	SELECT oa, geom FROM output_areas
	WHERE oa IN (SELECT oa FROM scope) AND oa NOT IN (SELECT oa FROM pieces)
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
	return `
CREATE OR REPLACE TABLE sectors AS
WITH counts AS (
	SELECT sector, count(*) AS postcodes FROM postcodes GROUP BY sector
),
shapes AS (
	SELECT sector, ST_Union_Agg(geom) AS geom FROM pieces GROUP BY sector
)
SELECT
	sector,
	split_part(sector, ' ', 1) AS district,
	regexp_extract(sector, '^[A-Z]+') AS area,
	coalesce(counts.postcodes, 0) AS postcodes,
	shapes.geom
FROM shapes
LEFT JOIN counts USING (sector)
${areas.length === 0 ? "" : `WHERE regexp_extract(sector, '^[A-Z]+') IN (${list(areas)})`}`;
}

const dissolveDistricts = `
CREATE OR REPLACE TABLE districts AS
SELECT district, area, sum(postcodes) AS postcodes, count(*) AS sectors, ST_Union_Agg(geom) AS geom
FROM sectors
GROUP BY district, area`;

/** Needs `postcodes` and `output_areas`; creates `sectors`, `districts` and `oa_lookup`. */
export async function computeBoundaries(
	connection: DuckDBConnection,
	{ areas = [], log = console.log }: { areas?: readonly string[]; log?: Log } = {},
): Promise<void> {
	const step = stepRunner(connection, log);
	const piecesCount = async () => Number((await rows(connection, "SELECT count(*) AS n FROM pieces"))[0]?.n);

	await step("scope", scope(areas));
	await step("sites", sites);
	await step("sectors per OA", sectorsPerOutputArea);
	await step("OA lookup", lookup);
	await step("whole OAs", wholeOutputAreas);
	await step("split OAs", splitOutputAreas);
	await step("Voronoi gaps", fillVoronoiGaps);

	let before: number;
	do {
		before = await piecesCount();
		await step("empty OAs", assignEmptyOutputAreas);
	} while ((await piecesCount()) > before);

	await step("sectors", dissolveSectors(areas));
	await step("districts", dissolveDistricts);
}

// ---------------------------------------------------------------------------
// Stage 3: outputs

const geoJson = (table: string, path: string): string => `
COPY (
	SELECT * EXCLUDE (geom), ST_Transform(geom, 'EPSG:27700', 'EPSG:4326', true) AS geom
	FROM ${table}
) TO ${literal(path)} WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_CREATION_OPTIONS 'COORDINATE_PRECISION=6')`;

export async function writeOutputs(connection: DuckDBConnection, outDir: string, log: Log = console.log): Promise<void> {
	const step = stepRunner(connection, log);
	await mkdir(outDir, { recursive: true });

	await step("sectors.geojson", geoJson("sectors", `${outDir}/sectors.geojson`));
	await step("districts.geojson", geoJson("districts", `${outDir}/districts.geojson`));
	await step("oa-lookup.csv", `COPY oa_lookup TO ${literal(`${outDir}/oa-lookup.csv`)} (HEADER)`);
}

// ---------------------------------------------------------------------------

export async function buildPostcodeBoundaries(options: Options): Promise<void> {
	const { outDir = "out", database = ":memory:", log = console.log } = options;
	const { connection, close } = await connect(database);

	try {
		await loadInputs(connection, options);
		await computeBoundaries(connection, options);
		await writeOutputs(connection, outDir, log);

		const [summary] = await rows(
			connection,
			`SELECT
				(SELECT count(*) FROM postcodes) AS postcodes,
				(SELECT count(*) FROM postcodes WHERE oa NOT IN (SELECT oa FROM output_areas)) AS without_boundary,
				(SELECT count(*) FROM oa_sectors WHERE sectors > 1) AS split_output_areas,
				(SELECT count(*) FROM scope WHERE oa NOT IN (SELECT oa FROM pieces)) AS unassigned_output_areas,
				(SELECT count(*) FROM sectors) AS sectors,
				(SELECT count(*) FROM districts) AS districts`,
		);
		console.table(summary);
	} finally {
		close();
	}
}
