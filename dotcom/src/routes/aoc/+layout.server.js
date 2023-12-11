import { paths } from "$lib/paths";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const load = async () => {
	const dir = join(dirname(fileURLToPath(import.meta.url)), "2023", "day");

	return {
		days: paths(dir).sort((a,b) => Number(a) - Number(b)).map((path) => ["day", path].join("/")),
	};
};
