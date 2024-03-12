import { paths } from "$lib/paths.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const load = async () => {
	const dir = dirname(fileURLToPath(import.meta.url));
	return {
		works: paths(dir).map((path) => ["travaux", path].join("/")),
	};
};
