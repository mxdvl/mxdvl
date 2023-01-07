import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { readdirSync } from "node:fs";

export const paths = (file: string) => {
	const dir = dirname(fileURLToPath(file));
	return readdirSync(dir, { encoding: "utf-8", withFileTypes: true })
		.filter((path) => path.isDirectory())
		.map(({ name }) => name)
		.filter((path) => !path.includes("slug"));
};
