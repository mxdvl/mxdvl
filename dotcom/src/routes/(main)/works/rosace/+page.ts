export const load = ({ url }) => {
	const state = url.searchParams.get("state");
	return { state };
};
