import { paths } from "$lib/paths";

export const load = async () => {

	return {
		days: paths(import.meta.url + "/../day/0").map(path => ["day", path].join("/")),
	};
};
