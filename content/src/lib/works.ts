import { readdirSync, readFileSync } from "fs";
import { SKIP, visit } from "unist-util-visit";
import { unified } from "unified";
import frontmatter from "remark-frontmatter";
import parse from "remark-parse";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";
import unwrap from "remark-unwrap-images";
import sharp from "sharp";
import type { Lang } from "$lib/lang";
import type { Plugin } from "unified";
import type { Root as HastRoot } from "@types/hast";
import type { Root as MdastRoot } from "@types/mdast";

type Work = {
	alt: string;
	metadata: {
		lang: Lang;
		title: string;
		date: string;
		at?: string;
	};
	content: string;
};

const isString = (value): value is string => typeof value === "string" && value !== "";

const getSlug = (path: string, slug?: unknown) =>
	isString(slug) ? slug : path.split("/").filter(Boolean).slice(-1)[0];

type Meta = {
	title?: string;
	date?: string;
	slug?: string;
	at?: string;
};
const getMeta = (root: MdastRoot): Meta => {
	// @ts-expect-error -- there is a value. Maybe MdastRoot is not the right type
	const matter: string | undefined = root.children.find((child) => child.type === "yaml")?.value;

	if (!matter) return {};

	return Object.fromEntries(
		matter.split("\n").map((line) => {
			const split = line.split(": ");
			const key = split[0];
			const value = split.slice(1).join(": ");
			return [key, value];
		}),
	);
};

const cloudinary: Plugin<Picture[], HastRoot> = (options = {}) => {
	const { pictures } = options;

	const cdn = "https://res.cloudinary.com/";
	const account = "mxdvl/image/upload";

	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			const { tagName } = node;

			if (parent && tagName === "img") {
				const { properties } = node;

				const src = properties.src.replace("static/", "content/");

				const child = {
					type: "element",
					tagName: "img",
					properties: {
						alt: properties.alt,
						srcset: [300, 600, 1200, 1800, 2400, 3000]
							.map((width) => {
								return `${new URL(`/${account}/w_${width}/${src}`, cdn)} ${width}w`;
							})
							.join(", "),
						src: new URL(`/${account}/w_${300}/${src}`, cdn),
					},
				};

				const picture = pictures.find((picture) => picture.path.endsWith(properties.src));

				node.tagName = "picture";
				node.properties = {
					style: `--ratio: ${picture.ratio}`,
				};
				node.children = [child];

				return [SKIP];
			}
		});
	};
};

type Picture = {
	path: string;
	width: number;
	height: number;
	ratio: number;
	format: string;
};

const getPicture = async (path: string): Promise<Picture> => {
	const image = readFileSync(path);
	const metadata = await sharp(image).metadata();
	const { width, height, format } = metadata;

	const basis = 6;
	const ratio = Math.round((height / width) * basis) / basis;

	return {
		path,
		width,
		height,
		ratio,
		format,
	};
};

const getPictures = async (path: string) =>
	Promise.all(
		readdirSync(path)
			.filter((file) => ["png", "jpg", "svg"].some((ext) => file.toLowerCase().endsWith(`.${ext}`)))
			.map((filename) => {
				return getPicture(`${path}/${filename}`);
			}),
	);

type WorkData = {
	lang: Lang;
	path: string;
	alt?: string;
};
const getWork = async ({ lang, path, alt }: WorkData): Work => {
	const fileContent = readFileSync(path, "utf8");
	const dir = path.split("/").slice(0, -1).join("/");

	const pictures = await getPictures(dir);

	const parsed = unified().use(parse).use(frontmatter).use(unwrap);
	const htmlProcessor = parsed()
		.use(rehype)
		.use(cloudinary, {
			pictures,
		})
		.use(stringify);

	const REPLACER = /(\]\()\.?\/?([\w-]+\.)/gi;
	const imgPaths = (s: string) => s.replace(REPLACER, `$1${dir}/$2`);

	const content: Work["content"] = htmlProcessor.processSync(imgPaths(fileContent)).toString();
	const meta: Meta = getMeta(parsed.parse(fileContent));

	const metadata: Work["metadata"] = {
		lang,
		title: meta.title ?? "⚠️ MISSING TITLE",
		date: dir.split("/").slice(-1)[0],
		at: isString(meta.at) ? meta.at : undefined,
	};

	return {
		alt,
		metadata,
		content,
	};
};

export type { Work, Picture };
export { getUrl, getTitle, cleanDate, getWork };
