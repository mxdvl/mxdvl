import { assertAlmostEquals, assertEquals } from "@std/assert";
import { computeBoundaries, connect, derivePostcodes, literal, rows } from "./boundaries.ts";
import type { Settings } from "./boundaries.ts";

type OutputArea = { oa: string; wkt: string };
type Postcode = { postcode: string; oa: string; x: number; y: number };

const rectangle = (x: number, y: number, width: number, height: number): string =>
	`POLYGON((${x} ${y}, ${x + width} ${y}, ${x + width} ${y + height}, ${x} ${y + height}, ${x} ${y}))`;

const square = (x: number, y: number, size: number): string => rectangle(x, y, size, size);

/** Runs the boundary stage on hand-made output areas and postcodes, in metres. */
async function build(
	outputAreas: readonly OutputArea[],
	postcodes: readonly Postcode[],
	settings: Settings = {},
) {
	const { connection, close } = await connect();

	const areaValues = outputAreas
		.map(({ oa, wkt }) => `(${literal(oa)}, ST_GeomFromText(${literal(wkt)}))`)
		.join(", ");
	await connection.run(`CREATE TABLE output_areas AS SELECT * FROM (VALUES ${areaValues}) AS t(oa, geom)`);

	const postcodeValues = postcodes
		.map(({ postcode, oa, x, y }) => `(${literal(postcode)}, ${literal(oa)}, 'E12000007', ${x}, ${y})`)
		.join(", ");
	await connection.run(
		`CREATE TABLE raw_postcodes AS SELECT * FROM (VALUES ${postcodeValues}) AS t(postcode, oa, region, x, y)`,
	);
	await connection.run(derivePostcodes("raw_postcodes"));

	await computeBoundaries(connection, { simplifyTolerance: 0, log: () => {}, ...settings });

	const query = (sql: string) => rows(connection, sql);
	const areaOf = async (table: string, column: string, value: string): Promise<number> => {
		const [row] = await query(`SELECT ST_Area(geom) AS area FROM ${table} WHERE ${column} = ${literal(value)}`);
		return Number(row?.area ?? 0);
	};

	return { query, areaOf, close };
}

Deno.test("an OA within one sector is kept whole", async () => {
	const { query, areaOf, close } = await build(
		[{ oa: "OA1", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 20, y: 20 },
			{ postcode: "E1 6AB", oa: "OA1", x: 80, y: 70 },
		],
	);

	try {
		assertEquals(await query("SELECT sector FROM sectors"), [{ sector: "E1 6" }]);
		assertAlmostEquals(await areaOf("sectors", "sector", "E1 6"), 10_000, 1e-6);
	} finally {
		close();
	}
});

Deno.test("an OA split between sectors is divided between its postcodes", async () => {
	const { areaOf, close } = await build(
		[{ oa: "OA1", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 25, y: 50 },
			{ postcode: "E1 7AA", oa: "OA1", x: 75, y: 50 },
		],
	);

	try {
		assertAlmostEquals(await areaOf("sectors", "sector", "E1 6"), 5_000, 1e-6);
		assertAlmostEquals(await areaOf("sectors", "sector", "E1 7"), 5_000, 1e-6);
	} finally {
		close();
	}
});

Deno.test("a large OA with clustered postcodes is still fully covered", async () => {
	const { query, close } = await build(
		[{ oa: "OA1", wkt: square(0, 0, 1_000) }],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 10, y: 10 },
			{ postcode: "E1 7AA", oa: "OA1", x: 20, y: 10 },
		],
	);

	try {
		const [row] = await query("SELECT sum(ST_Area(geom)) AS area FROM sectors");
		assertAlmostEquals(Number(row?.area), 1_000_000, 1e-3);
	} finally {
		close();
	}
});

Deno.test("an OA without postcodes joins the neighbour it shares most border with", async () => {
	const { areaOf, close } = await build(
		[
			{ oa: "OA1", wkt: square(0, 0, 100) }, // shares 100 m with OA3
			{ oa: "OA2", wkt: rectangle(200, 0, 100, 50) }, // shares 50 m with OA3
			{ oa: "OA3", wkt: square(100, 0, 100) }, // no postcodes
		],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 50, y: 50 },
			{ postcode: "E2 1AA", oa: "OA2", x: 250, y: 25 },
		],
	);

	try {
		assertAlmostEquals(await areaOf("sectors", "sector", "E1 6"), 20_000, 1e-6);
		assertAlmostEquals(await areaOf("sectors", "sector", "E2 1"), 5_000, 1e-6);
	} finally {
		close();
	}
});

/** A 3×3 grid of OAs with a mix of whole, split and empty ones */
const grid = {
	outputAreas: [0, 1, 2].flatMap((column) =>
		[0, 1, 2].map((row) => ({ oa: `OA${column}${row}`, wkt: square(column * 100, row * 100, 100) }))
	),
	postcodes: [
		{ postcode: "E1 6AA", oa: "OA00", x: 30, y: 30 },
		{ postcode: "E1 6AB", oa: "OA00", x: 60, y: 70 },
		{ postcode: "E1 6AD", oa: "OA10", x: 120, y: 40 },
		{ postcode: "E1 7AA", oa: "OA10", x: 180, y: 60 },
		{ postcode: "E1 7AB", oa: "OA20", x: 250, y: 50 },
		{ postcode: "E2 1AA", oa: "OA01", x: 50, y: 150 },
		{ postcode: "E2 1AB", oa: "OA02", x: 40, y: 260 },
		{ postcode: "E2 2AA", oa: "OA12", x: 150, y: 250 },
		{ postcode: "E1 7AD", oa: "OA21", x: 210, y: 110 },
		{ postcode: "E2 2AB", oa: "OA21", x: 290, y: 190 },
		// OA11 and OA22 have no postcodes
	],
};

Deno.test("sectors tile the OAs and districts nest the sectors", async () => {
	const { query, close } = await build(grid.outputAreas, grid.postcodes);

	try {
		const [areas] = await query(`SELECT
			(SELECT sum(ST_Area(geom)) FROM output_areas) AS output_areas,
			(SELECT sum(ST_Area(geom)) FROM sectors) AS sectors,
			(SELECT ST_Area(ST_Union_Agg(geom)) FROM sectors) AS sectors_union,
			(SELECT sum(ST_Area(geom)) FROM districts) AS districts`);

		assertAlmostEquals(Number(areas?.sectors), Number(areas?.output_areas), 1e-3, "no gaps");
		assertAlmostEquals(Number(areas?.sectors_union), Number(areas?.sectors), 1e-3, "no overlaps");
		assertAlmostEquals(Number(areas?.districts), Number(areas?.sectors), 1e-3, "districts match sectors");

		const outside = await query(`SELECT s.sector
			FROM sectors s JOIN districts d USING (district)
			WHERE ST_Area(ST_Difference(s.geom, d.geom)) > 1e-3`);
		assertEquals(outside, [], "every sector sits inside its district");
	} finally {
		close();
	}
});

Deno.test("every postcode falls inside its own sector", async () => {
	const { query, close } = await build(grid.outputAreas, grid.postcodes);

	try {
		const misplaced = await query(`SELECT p.postcode
			FROM postcodes p JOIN sectors s USING (sector)
			WHERE NOT ST_Intersects(s.geom, ST_Point(p.x, p.y))`);
		assertEquals(misplaced, []);
	} finally {
		close();
	}
});

Deno.test("an area run keeps only that area, with edges from its neighbours", async () => {
	const { query, areaOf, close } = await build(
		[{ oa: "OA1", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 25, y: 50 },
			{ postcode: "IG1 1AA", oa: "OA1", x: 75, y: 50 },
		],
		{ areas: ["E"] },
	);

	try {
		assertEquals(await query("SELECT sector FROM sectors"), [{ sector: "E1 6" }]);
		assertAlmostEquals(await areaOf("sectors", "sector", "E1 6"), 5_000, 1e-6);
	} finally {
		close();
	}
});

Deno.test("the OA lookup reports the dominant sector and district", async () => {
	const { query, close } = await build(
		[{ oa: "OA1", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "OA1", x: 10, y: 10 },
			{ postcode: "E1 6AB", oa: "OA1", x: 20, y: 20 },
			{ postcode: "E1 6AD", oa: "OA1", x: 30, y: 30 },
			{ postcode: "E1 7AA", oa: "OA1", x: 90, y: 90 },
		],
	);

	try {
		const [lookup] = await query("SELECT * FROM oa_lookup");
		assertEquals(lookup?.sector, "E1 6");
		assertAlmostEquals(Number(lookup?.sector_share), 0.75, 1e-9);
		assertEquals(lookup?.district, "E1");
		assertAlmostEquals(Number(lookup?.district_share), 1, 1e-9);
	} finally {
		close();
	}
});
