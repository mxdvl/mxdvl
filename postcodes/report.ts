/**
 * node report.ts out/work.duckdb [oa-purity.sql]
 * Runs a SQL file against a database built with --db and prints the result.
 */

import { DuckDBInstance } from "@duckdb/node-api";
import { readFile } from "node:fs/promises";
import process from "node:process";

const [database, file = new URL("./oa-purity.sql", import.meta.url).pathname] = process.argv.slice(2);

if (!database) {
	console.error("Usage: report.ts <database.duckdb> [query.sql]");
	process.exit(1);
}

const instance = await DuckDBInstance.create(database);
const connection = await instance.connect();
const reader = await connection.runAndReadAll(await readFile(file, "utf8"));

console.table(reader.getRowObjectsJson());

connection.closeSync();
instance.closeSync();
