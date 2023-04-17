export const GET = ({ url }) => {
	return new Response(undefined, {
		status: 302,
		headers: { Location: url.href.replace("/travaux/bobbin", "/works/bobbin") },
	});
};
