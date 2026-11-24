/**
 * deno task postcodes --nspl data/NSPL.csv --oa data/OA_2021_EW_BGC_V2.shp --area E
 */

import { parseArgs } from "node:util";
import process from "node:process";
import { buildPostcodeBoundaries } from "./boundaries.ts";

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		nspl: { type: "string" },
		oa: { type: "string" },
		area: { type: "string", multiple: true },
		out: { type: "string" },
		db: { type: "string" },
	},
});

if (!values.nspl || !values.oa) {
	console.error("Usage: cli.ts --nspl <csv> --oa <shp> [--area E …] [--out dir] [--db file]");
	process.exit(1);
}

await buildPostcodeBoundaries({
	nspl: values.nspl,
	outputAreas: values.oa,
	areas: values.area?.map((area) => area.toUpperCase()),
	outDir: values.out,
	database: values.db,
});
