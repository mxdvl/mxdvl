import type { Lang } from '$lib/lang';
import type { Plugin } from 'unified';
import { unified } from 'unified';
import frontmatter from 'remark-frontmatter';
import parse from 'remark-parse';
import stringify from 'rehype-stringify';
import rehype from 'remark-rehype';
import unwrap from 'remark-unwrap-images';
import { SKIP, visit } from 'unist-util-visit';
import type { Root as HastRoot } from '@types/hast';
import type { Root as MdastRoot } from '@types/mdast';

const endpoint = process.env.PRODUCTION ? 'https://content.mxdvl.com' : '';

type Work = {
	urls: {
		en: `/works/${string}`;
		fr?: `/travaux/${string}`;
	};
	metadata: {
		titles: {
			en: string;
			fr?: string;
		};
		date: string;
		at?: string;
	};
	content: {
		en: string;
		fr?: string;
	};
};

type Picture = {
	path: string;
	width: number;
	height: number;
	ratio: number;
	format: string;
};

const isString = (value): value is string => typeof value === 'string' && value !== '';

const getSlug = (path: string, slug?: unknown) =>
	isString(slug) ? slug : path.split('/').filter(Boolean).slice(-1)[0];

const getMeta = (root: MdastRoot): Meta => {
	// @ts-expect-error -- there is a value. Maybe MdastRoot is not the right type
	const matter: string | undefined = root.children.find((child) => child.type === 'yaml')?.value;

	if (!matter) return {};

	return Object.fromEntries(
		matter.split('\n').map((line) => {
			const split = line.split(': ');
			const key = split[0];
			const value = split.slice(1).join(': ');
			return [key, value];
		})
	);
};

type Meta = {
	title?: string;
	date?: string;
	slug?: string;
	at?: string;
};

const cloudinary: Plugin<Picture[], HastRoot> = (options = {}) => {
	const { pictures } = options;

	const cdn = 'https://res.cloudinary.com/mxdvl/image/upload';
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			const { tagName } = node;

			if (parent && tagName === 'img') {
				const { properties } = node;

				const child = {
					type: 'element',
					tagName: 'img',
					properties: {
						alt: properties.alt,
						srcset: [300, 600, 1200, 1800, 2400, 3000]
							.map((width) => {
								const src = properties.src.replace('static/', 'content/');
								return `${new URL(`/w_${width}/${src}`, cdn)} ${width}w`;
							})
							.join(', '),
						src: new URL(`/w_300/${properties.src}`, cdn)
					}
				};

				const picture = pictures.find((picture) => picture.path.endsWith(properties.src));

				node.tagName = 'picture';
				node.properties = {
					style: `--ratio: ${picture.ratio}`
				};
				node.children = [child];

				return [SKIP];
			}
		});
	};
};

const getWork = (path: string, en: string, fr?: string, pictures: Picture[]): Work => {
	const parsed = unified().use(parse).use(frontmatter).use(unwrap);
	const htmlProcessor = parsed()
		.use(rehype)
		.use(cloudinary, {
			pictures
		})
		.use(stringify);

	const REPLACER = /(\]\()\.?\/?([\w-]+\.)/gi;
	const imgPaths = (s: string) => s.replace(REPLACER, `$1${path}/$2`);

	const content: Work['content'] = {
		en: htmlProcessor.processSync(imgPaths(en)).toString(),
		fr: fr ? htmlProcessor.processSync(imgPaths(fr)).toString() : undefined
	};

	const meta: Record<Lang, Meta> = {
		en: getMeta(parsed.parse(en)),
		fr: getMeta(parsed.parse(fr))
	};

	const metadata: Work['metadata'] = {
		titles: {
			en: isString(meta.en.title) ? meta.en.title : '⚠️ MISSING TITLE',
			fr: meta.fr?.title
		},
		date: isString(meta.en.date) ? new Date(meta.en.date).toISOString() : '** MISSING DATE **',
		at: isString(meta.en.at) ? meta.en.at : undefined
	};

	const urls: Work['urls'] = {
		en: `${endpoint}/works/${getSlug(path)}.json`,
		fr: fr ? `${endpoint}/travaux/${getSlug(path, meta.fr.slug)}.json` : undefined
	};

	return {
		urls,
		metadata,
		content
	};
};

export type { Work, Picture };
export { getUrl, getTitle, cleanDate, getWork };
