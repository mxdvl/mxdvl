import { redirect } from "@sveltejs/kit";

export const GET = () => {
	throw redirect(307, "/aoc/2023");
};
