/**
 * deno task postcodes --nspl data/NSPL.csv --oa OA21CD=data/oa21.gpkg --area E
 * node postcodes/cli.ts …same flags
 *
 * --oa CODE_COLUMN=path            boundary file in British National Grid
 * --oa CODE_COLUMN@EPSG:xxxx=path  boundary file in another CRS
 */

import { parseArgs } from "node:util";
import process from "node:process";
import { buildPostcodeBoundaries } from "./boundaries.ts";
import type { BoundarySource } from "./boundaries.ts";

function parseSource(argument: string): BoundarySource {
	const separator = argument.indexOf("=");
	if (separator < 1) throw new Error(`--oa expects CODE_COLUMN=path, got “${argument}”`);

	const [codeColumn = "", crs] = argument.slice(0, separator).split("@");
	return { codeColumn, crs, path: argument.slice(separator + 1) };
}

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		nspl: { type: "string" },
		oa: { type: "string", multiple: true },
		area: { type: "string", multiple: true },
		out: { type: "string" },
		db: { type: "string" },
		simplify: { type: "string" },
		"large-users": { type: "boolean" },
	},
});

if (!values.nspl || !values.oa?.length) {
	console.error("Usage: cli.ts --nspl <csv> --oa CODE_COLUMN=<file> [--oa …] [--area E] [--out dir] [--simplify 10]");
	process.exit(1);
}

await buildPostcodeBoundaries({
	nspl: values.nspl,
	outputAreas: values.oa.map(parseSource),
	areas: values.area?.map((area) => area.toUpperCase()),
	outDir: values.out,
	database: values.db,
	includeLargeUsers: values["large-users"],
	simplifyTolerance: values.simplify === undefined ? undefined : Number(values.simplify),
});
