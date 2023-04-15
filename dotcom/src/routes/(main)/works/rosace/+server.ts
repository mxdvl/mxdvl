export const GET = ({ url }) => {
	return new Response(undefined, {
		status: 301,
		headers: { Location: url.href.replace("/rosace", "/bobbin") },
	});
};
