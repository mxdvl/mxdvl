import { readdirSync } from "node:fs";

/** @param {import("node:fs").PathLike} dir */
export const paths = (dir) => {
	return readdirSync(dir, { encoding: "utf-8", withFileTypes: true })
		.filter((path) => path.isDirectory())
		.map(({ name }) => name)
		.filter((path) => !path.includes("slug"));
};
