import type { PageServerLoad } from "./$types";
import { paths } from "../../lib/paths";

export const load: PageServerLoad = async () => {
	return {
		works: paths(import.meta.url),
	};
};
