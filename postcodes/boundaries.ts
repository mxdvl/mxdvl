/**
 * Approximate postcode sector & district boundaries for England and Wales,
 * from open data only: the NSPL and census Output Area (OA) boundaries.
 *
 * Hypothesis: most OAs sit entirely inside one postcode sector. If so:
 *   1. give each OA to the sector most of its postcodes belong to,
 *   2. merge OAs into sectors, and sectors into districts.
 *
 * TODO(reality): test the hypothesis first. The summary’s
 * `split_between_sectors` and `oa_lookup.sector_share` say how many OAs
 * straddle sectors, and by how much. If it’s many, this approach needs OA
 * splitting, or a different approach.
 *
 * OA boundaries are clipped to the coastline and follow roads, rivers and
 * council boundaries, so the result inherits those edges.
 *
 * Known gaps, on purpose:
 * - An OA split between sectors goes whole to its majority sector.
 *   `oa_lookup.sector_share` says how often, and by how much.
 * - An OA with no usable postcode belongs to no sector, leaving a hole.
 *
 * TODO(reality): none of this has been run against the real NSPL and OA files.
 * Every `TODO(reality)` marks an assumption to check on the first run.
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
	/** Postcode areas to keep, e.g. ["E"]. Empty keeps all of England and Wales. */
	areas?: readonly string[];
	outDir?: string;
	/** DuckDB database file. Use a path to inspect the tables afterwards. */
	database?: string;
	log?: Log;
};

/** A DuckDB connection with the spatial extension, closed when it goes out of scope */
export type Database = Disposable & { connection: DuckDBConnection; log: Log };

export async function buildPostcodeBoundaries(options: Options): Promise<void> {
	const { outDir = "out", database = ":memory:", log = console.log } = options;
	using db = await connect({ database, log });

	await loadInputs(db, options);
	await computeBoundaries(db, options);
	await writeOutputs(db, outDir);

	const [summary] = await rows(db, summarySql());
	console.table(summary);
}

// ---------------------------------------------------------------------------
// Inputs → `postcodes`, `output_areas`

export async function loadInputs(db: Database, { nspl, outputAreas }: Options): Promise<void> {
	await loadPostcodes(db, nspl);
	await step(db, "output areas", outputAreasSql(outputAreas));
}

export async function loadPostcodes(db: Database, nspl: string): Promise<void> {
	await step(db, "postcodes", postcodesSql(nspl));
}

/**
 * Live, small-user postcodes in England and Wales.
 *
 * TODO(reality): check `read_csv` guesses the types we compare against:
 * `doterm` empty → NULL, `usrtypind` numeric, `oa21cd` text.
 * TODO(reality): check the column names after `normalize_names`.
 * TODO(reality): should poor grid references (`gridind` 6+, e.g. sector means)
 * be excluded? They could pull an OA towards the wrong sector.
 */
function postcodesSql(nspl: string): string {
	return `
CREATE OR REPLACE TABLE postcodes AS
SELECT
	pcds AS postcode,
	split_part(pcds, ' ', 1) AS district,
	split_part(pcds, ' ', 1) || ' ' || left(split_part(pcds, ' ', 2), 1) AS sector,
	oa21cd AS oa
FROM read_csv(${literal(nspl)}, normalize_names = true)
WHERE doterm IS NULL
	AND usrtypind = 0
	AND (oa21cd LIKE 'E00%' OR oa21cd LIKE 'W00%')`;
}

/**
 * TODO(reality): check `ST_Read` names the geometry column `geom`, and that
 * the attribute is `OA21CD`.
 * TODO(reality): check whether `ST_MakeValid` is needed, or just slow.
 */
function outputAreasSql(path: string): string {
	return `
CREATE OR REPLACE TABLE output_areas AS
SELECT OA21CD AS oa, ST_MakeValid(geom) AS geom
FROM ST_Read(${literal(path)})`;
}

// ---------------------------------------------------------------------------
// Boundaries → `oa_lookup`, `sectors`, `districts`

/** Needs `postcodes` and `output_areas`. */
export async function computeBoundaries(
	db: Database,
	{ areas = [] }: { areas?: readonly string[] } = {},
): Promise<void> {
	await step(db, "OA lookup", lookupSql());
	await step(db, "sectors", sectorsSql(areas));
	await step(db, "districts", districtsSql());
}

/**
 * Dominant sector and district of each OA, and the share of its postcodes in them.
 *
 * TODO(reality): `arg_max` picks arbitrarily between tied sectors. Count how
 * many OAs tie before deciding whether a tie-break matters.
 */
function lookupSql(): string {
	return `
CREATE OR REPLACE TABLE oa_lookup AS
WITH by_sector AS (
	SELECT oa, sector, district, count(*) AS n FROM postcodes GROUP BY ALL
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
}

/**
 * TODO(reality): check `ST_Union_Agg` merges neighbouring OAs cleanly, without
 * slivers along shared edges.
 */
function sectorsSql(areas: readonly string[]): string {
	return `
CREATE OR REPLACE TABLE sectors AS
SELECT
	l.sector,
	l.district,
	sum(l.postcodes) AS postcodes,
	count(*) AS output_areas,
	ST_Union_Agg(o.geom) AS geom
FROM oa_lookup l
JOIN output_areas o USING (oa)
${areas.length === 0 ? "" : `WHERE regexp_extract(l.sector, '^[A-Z]+') IN (${list(areas)})`}
GROUP BY l.sector, l.district`;
}

function districtsSql(): string {
	return `
CREATE OR REPLACE TABLE districts AS
SELECT district, sum(postcodes) AS postcodes, count(*) AS sectors, ST_Union_Agg(geom) AS geom
FROM sectors
GROUP BY district`;
}

// ---------------------------------------------------------------------------
// Outputs

export async function writeOutputs(db: Database, outDir: string): Promise<void> {
	await mkdir(outDir, { recursive: true });

	await step(db, "sectors.geojson", geoJsonSql("sectors", `${outDir}/sectors.geojson`));
	await step(db, "districts.geojson", geoJsonSql("districts", `${outDir}/districts.geojson`));
	await step(db, "oa-lookup.csv", `COPY oa_lookup TO ${literal(`${outDir}/oa-lookup.csv`)} (HEADER)`);
}

/**
 * TODO(reality): check the GDAL `COPY` options work in the installed DuckDB.
 * TODO(reality): PROJ’s default British National Grid → WGS84 transformation
 * is accurate to a few metres. Check that’s acceptable.
 */
function geoJsonSql(table: string, path: string): string {
	return `
COPY (
	SELECT * EXCLUDE (geom), ST_Transform(geom, 'EPSG:27700', 'EPSG:4326', true) AS geom
	FROM ${table}
) TO ${literal(path)} WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_CREATION_OPTIONS 'COORDINATE_PRECISION=6')`;
}

/** The numbers to look at first, to judge whether the simple method is good enough */
function summarySql(): string {
	return `
SELECT
	(SELECT count(*) FROM postcodes) AS postcodes,
	(SELECT count(*) FROM output_areas) AS output_areas,
	(SELECT count(*) FROM output_areas WHERE oa NOT IN (SELECT oa FROM oa_lookup)) AS without_postcodes,
	(SELECT count(*) FROM oa_lookup WHERE sector_share < 1) AS split_between_sectors,
	(SELECT count(*) FROM oa_lookup WHERE district_share < 1) AS split_between_districts,
	(SELECT count(*) FROM sectors) AS sectors,
	(SELECT count(*) FROM districts) AS districts`;
}

// ---------------------------------------------------------------------------
// DuckDB helpers

export async function connect(
	{ database = ":memory:", log = console.log }: { database?: string; log?: Log } = {},
): Promise<Database> {
	const instance = await DuckDBInstance.create(database);
	const connection = await instance.connect();
	await connection.run("INSTALL spatial; LOAD spatial;");

	return {
		connection,
		log,
		[Symbol.dispose]() {
			connection.closeSync();
			instance.closeSync();
		},
	};
}

/**
 * TODO(reality): check how `getRowObjectsJson` encodes DuckDB numbers
 * (BIGINT may come back as a string).
 */
export async function rows(db: Database, sql: string): Promise<Record<string, unknown>[]> {
	const reader = await db.connection.runAndReadAll(sql);
	return reader.getRowObjectsJson() as Record<string, unknown>[];
}

async function step(db: Database, name: string, sql: string): Promise<void> {
	const start = performance.now();
	await db.connection.run(sql);
	db.log(`✓ ${name} (${((performance.now() - start) / 1000).toFixed(1)}s)`);
}

/** SQL string literal */
export function literal(value: string): string {
	return `'${value.replaceAll("'", "''")}'`;
}

function list(values: readonly string[]): string {
	return values.map(literal).join(", ");
}
