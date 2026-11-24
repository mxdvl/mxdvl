/**
 * Tiny made-up OAs and postcodes, in metres, run through the real SQL.
 *
 * TODO(reality): these tests have never run. Check DuckDB accepts geometries
 * in `VALUES`, and that `read_csv` reads the fixture CSV with the same types
 * as the real NSPL.
 */

import { assertAlmostEquals, assertEquals } from "@std/assert";
import { computeBoundaries, connect, literal, loadPostcodes, rows } from "./boundaries.ts";

type OutputArea = { oa: string; wkt: string };
type Postcode = { postcode: string; oa: string; terminated?: string; largeUser?: boolean };

Deno.test("an OA within one sector is kept whole", async () => {
	using fixture = await build(
		[{ oa: "E00000001", wkt: square(0, 0, 100) }],
		[{ postcode: "E1 6AA", oa: "E00000001" }, { postcode: "E1 6AB", oa: "E00000001" }],
	);

	assertEquals(await fixture.query("SELECT sector FROM sectors"), [{ sector: "E1 6" }]);
	assertAlmostEquals(await fixture.areaOf("sectors", "E1 6"), 10_000, 1e-6);
});

Deno.test("an OA split between sectors goes whole to its majority sector", async () => {
	using fixture = await build(
		[{ oa: "E00000001", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "E00000001" },
			{ postcode: "E1 6AB", oa: "E00000001" },
			{ postcode: "E1 7AA", oa: "E00000001" },
		],
	);

	assertEquals(await fixture.query("SELECT sector FROM sectors"), [{ sector: "E1 6" }]);

	const [lookup] = await fixture.query("SELECT * FROM oa_lookup");
	assertEquals(lookup?.sector, "E1 6");
	assertAlmostEquals(Number(lookup?.sector_share), 2 / 3, 1e-9);
	assertEquals(lookup?.district, "E1");
	assertAlmostEquals(Number(lookup?.district_share), 1, 1e-9);
});

Deno.test("an OA without postcodes is left out", async () => {
	using fixture = await build(
		[
			{ oa: "E00000001", wkt: square(0, 0, 100) },
			{ oa: "E00000002", wkt: square(100, 0, 100) }, // no postcodes
		],
		[{ postcode: "E1 6AA", oa: "E00000001" }],
	);

	assertAlmostEquals(await fixture.areaOf("sectors", "E1 6"), 10_000, 1e-6);
});

Deno.test("terminated, large-user and Scottish postcodes are ignored", async () => {
	using fixture = await build(
		[{ oa: "E00000001", wkt: square(0, 0, 100) }],
		[
			{ postcode: "E1 6AA", oa: "E00000001" },
			{ postcode: "E1 7AA", oa: "E00000001", terminated: "202301" },
			{ postcode: "E1 7AB", oa: "E00000001", largeUser: true },
			{ postcode: "TD1 1AA", oa: "S00000001" },
		],
	);

	assertEquals(await fixture.query("SELECT postcode FROM postcodes"), [{ postcode: "E1 6AA" }]);
});

Deno.test("sectors tile the OAs and districts nest the sectors", async () => {
	using fixture = await build(
		// a 2×2 grid of OAs
		[0, 1].flatMap((column) =>
			[0, 1].map((row) => ({ oa: `E0000000${column}${row}`, wkt: square(column * 100, row * 100, 100) }))
		),
		[
			{ postcode: "E1 6AA", oa: "E000000000" },
			{ postcode: "E1 6AB", oa: "E000000010" },
			{ postcode: "E1 7AA", oa: "E000000001" },
			{ postcode: "E2 1AA", oa: "E000000011" },
		],
	);

	const [areas] = await fixture.query(`SELECT
		(SELECT sum(ST_Area(geom)) FROM sectors) AS sectors,
		(SELECT ST_Area(ST_Union_Agg(geom)) FROM sectors) AS sectors_union,
		(SELECT sum(ST_Area(geom)) FROM districts) AS districts`);

	assertAlmostEquals(Number(areas?.sectors), 40_000, 1e-3, "no gaps");
	assertAlmostEquals(Number(areas?.sectors_union), 40_000, 1e-3, "no overlaps");
	assertAlmostEquals(Number(areas?.districts), 40_000, 1e-3, "districts match sectors");
	assertAlmostEquals(await fixture.areaOf("districts", "E1"), 30_000, 1e-3);
});

Deno.test("an area run keeps only sectors in that area", async () => {
	using fixture = await build(
		[
			{ oa: "E00000001", wkt: square(0, 0, 100) },
			{ oa: "E00000002", wkt: square(100, 0, 100) },
		],
		[{ postcode: "E1 6AA", oa: "E00000001" }, { postcode: "IG1 1AA", oa: "E00000002" }],
		["E"],
	);

	assertEquals(await fixture.query("SELECT sector FROM sectors"), [{ sector: "E1 6" }]);
});

// ---------------------------------------------------------------------------
// Fixtures

type Fixture = Disposable & {
	query(sql: string): Promise<Record<string, unknown>[]>;
	areaOf(table: "sectors" | "districts", name: string): Promise<number>;
};

/** Writes the postcodes as an NSPL-shaped CSV, then runs the boundary stage. */
async function build(
	outputAreas: readonly OutputArea[],
	postcodes: readonly Postcode[],
	areas: readonly string[] = [],
): Promise<Fixture> {
	const nspl = await Deno.makeTempFile({ suffix: ".csv" });
	await Deno.writeTextFile(nspl, nsplCsv(postcodes));

	const db = await connect({ log() {} });
	await loadPostcodes(db, nspl);

	const values = outputAreas.map(({ oa, wkt }) => `(${literal(oa)}, ST_GeomFromText(${literal(wkt)}))`);
	await db.connection.run(`CREATE TABLE output_areas AS SELECT * FROM (VALUES ${values.join(", ")}) AS t(oa, geom)`);

	await computeBoundaries(db, { areas });

	return {
		query(sql) {
			return rows(db, sql);
		},
		async areaOf(table, name) {
			const key = table === "sectors" ? "sector" : "district";
			const [row] = await rows(db, `SELECT ST_Area(geom) AS area FROM ${table} WHERE ${key} = ${literal(name)}`);
			return Number(row?.area ?? 0);
		},
		[Symbol.dispose]() {
			db[Symbol.dispose]();
			Deno.removeSync(nspl);
		},
	};
}

/** Only the NSPL columns the pipeline reads */
function nsplCsv(postcodes: readonly Postcode[]): string {
	const lines = postcodes.map(({ postcode, oa, terminated = "", largeUser = false }) =>
		[postcode, terminated, largeUser ? 1 : 0, oa].join(",")
	);
	return ["PCDS,DOTERM,USRTYPIND,OA21CD", ...lines].join("\n") + "\n";
}

function square(x: number, y: number, size: number): string {
	return `POLYGON((${x} ${y}, ${x + size} ${y}, ${x + size} ${y + size}, ${x} ${y + size}, ${x} ${y}))`;
}
