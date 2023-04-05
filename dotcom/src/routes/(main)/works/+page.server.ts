import { paths } from "$lib/paths";

export const load = async () => {
	return {
		works: paths(import.meta.url).map((path) => ["works", path].join("/")),
	};
};
