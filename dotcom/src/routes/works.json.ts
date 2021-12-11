import type { RequestHandler } from "@sveltejs/kit";

const imports = import.meta.globEager('../../../content/works/**/*.en.md')

const works = Object.entries(imports).map(([path, entry]) => {

	const slug = path.split('/').filter(Boolean).slice(-1)

	return {
		metadata: {
			slug,
			...entry.metadata
		},
		content: entry.default.render(),
	}
})

export const get: RequestHandler = async ({ params }) => {
	const slug = params;

	if (!works) return;
	return {
		body: {
			works,
		}
	}
}
