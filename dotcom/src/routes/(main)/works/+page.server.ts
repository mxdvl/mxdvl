import { paths } from "$lib/paths.js";

export const load = async () => {
	return {
		works: paths(import.meta.url).map((path) => ["works", path].join("/")),
	};
};
