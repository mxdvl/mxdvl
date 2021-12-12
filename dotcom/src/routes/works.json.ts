import type { RequestHandler } from "@sveltejs/kit";

const imports = import.meta.globEager('../../../content/works/**/*.en.md')

export type Work = {
	url: `https://www.mxdvl.com/works/${string}`;
	slug: string;
	metadata: {
		title: string;
		date: `${number}-${number}` | string;
	}
	content: {
		html: string
	};
}

const isString = (value): value is string => typeof value === 'string' && value !== ''

export const getWorks = (): Work[] => Object.entries(imports).map(([path, entry]) => {
	const slug = path.split('/').filter(Boolean).slice(-2)[0]
	const parsed: Record<keyof Work['metadata'], unknown> = entry.metadata;
	const metadata: Work['metadata'] = {
		title: isString(parsed.title) ? parsed.title : "⚠️ MISSING TITLE",
		date: isString(parsed.date) ? parsed.date : "MISSING DATE",
	}

		const url: Work["url"] = `https://www.mxdvl.com/works/${slug}`;

	return {
			url,
		slug,
		metadata,
		content,
	}
})

export const get: RequestHandler = async ({ params }) => {
	const works = getWorks();
	if (!works) return;
	return {
		body: {
			works,
		}
	}
}
