import { readdirSync, readFileSync } from "fs";
import { SKIP, visit } from "unist-util-visit";
import { unified } from "unified";
import frontmatter from "remark-frontmatter";
import parse from "remark-parse";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";
import unwrap from "remark-unwrap-images";
import sharp from "sharp";
import type { Lang } from "@mxdvl/dotcom/lib/lang";
import type { Plugin } from "unified";
import type { ElementContent, Root as HastRoot } from "hast";
import type { Content, Root as MdastRoot, YAML } from "mdast";

type Work = {
	alt?: string;
	metadata: {
		lang: Lang;
		title: string;
		date: string;
		at?: string;
	};
	content: string;
};

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim() !== "";
const isYaml = (content: Content): content is YAML => content.type === "yaml";

type Meta = {
	title?: string;
	date?: string;
	slug?: string;
	at?: string;
};
const getMeta = (root: MdastRoot): Meta => {
	const matter = root.children.find(isYaml)?.value;

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

const transforms = (width: number) => ["c_scale", "f_auto", "q_auto:best", `w_${width}`].join(",");

const GRID_SIZE = 18;

/**
 * Keep in sync with app.css
 * @link dotcom/src/app.css
 */
const sizes = [
	[360, 18],
	[620, 30],
	[740, 36],
	[960, 48],
	[1200, 66],
	[1400, 72],
] as const;

const cloudinary: Plugin<[Picture[]], HastRoot> = (pictures) => {
	const cdn = "https://res.cloudinary.com/";
	const account = "mxdvl/image/upload";

	return (tree) => {
		visit(tree, "element", (node, _, parent) => {
			if (node.type !== "element") throw new Error("Not an element");

			const { tagName } = node;

			if (parent && tagName === "img") {
				const { properties } = node;

				if (!properties) return [SKIP];

				const src = String(properties.src).replace("static/", "");

				const child: ElementContent = {
					type: "element",
					tagName: "img",
					properties: {
						alt: properties.alt,
						srcset: sizes
							.flatMap(([, width]) => [1, 2].map((dpr) => dpr * width * GRID_SIZE))
							.map((width) => {
								return `${new URL(`/${account}/${transforms(width)}/content/${src}`, cdn)} ${width}w`;
							})
							.join(", "),
						src: new URL(`/${account}/${transforms(300)}/content/${src}`, cdn).toString(),
						sizes: sizes
							.slice()
							.sort(([a], [b]) => b - a)
							.map(([width, size]) => `(min-width: ${width}px) ${size * GRID_SIZE}px`)
							.concat("96vw")
							.join(", "),
					},
					children: [],
				};

				const picture = pictures.find((picture) => picture.path.endsWith(String(properties.src)));

				if (!picture) return [SKIP];

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

const formats = ["png", "jpg", "svg"] as const;
type Format = (typeof formats)[number];
const isFormat = (format: string | undefined): format is Format =>
	// @ts-expect-error -- we’re using a type predicate
	formats?.includes(format);

type Picture = {
	path: string;
	width: number;
	height: number;
	ratio: number;
	format: Format | "error";
};

const getPicture = async (path: string): Promise<Picture> => {
	const image = readFileSync(path);
	const metadata = await sharp(image).metadata();
	const { width = -1, height = -1, format } = metadata;

	const basis = 6;
	const ratio = Math.round((height / width) * basis) / basis;

	return {
		path,
		width,
		height,
		ratio,
		format: isFormat(format) ? format : "error",
	};
};

const getPictures = async (path: string) =>
	Promise.all(
		readdirSync(path)
			.filter((file) => formats.some((ext) => file.toLowerCase().endsWith(`.${ext}`)))
			.map((filename) => getPicture(`${path}/${filename}`)),
	);

type WorkData = {
	alt: Work["alt"];
	lang: Work["metadata"]["lang"];
	path: string;
};
const getWork = async ({ lang, path, alt }: WorkData): Promise<Work> => {
	const fileContent = readFileSync(path, "utf8");
	const dir = path.split("/").slice(0, -1).join("/");

	const pictures = await getPictures(dir);

	const parsed = unified().use(parse).use(frontmatter).use(unwrap);
	const htmlProcessor = parsed().use(rehype).use(cloudinary, pictures).use(stringify);

	const REPLACER = /(\]\()\.?\/?([\w-]+\.)/gi;
	const imgPaths = (s: string) => s.replace(REPLACER, `$1${dir}/$2`);

	const content: Work["content"] = htmlProcessor.processSync(imgPaths(fileContent)).toString();
	const meta: Meta = getMeta(parsed.parse(fileContent));

	const metadata: Work["metadata"] = {
		lang,
		title: meta.title ?? "⚠️ MISSING TITLE",
		date: dir.split("/").slice(-1)[0] ?? "2007-01-14",
		at: isNonEmptyString(meta.at) ? meta.at : undefined,
	};

	return {
		alt,
		metadata,
		content,
	};
};

const dirs = readdirSync("static").filter((dir) => !dir.includes("."));

type WorkUrls = {
	en: string;
	fr?: string;
	date: string;
};
const getUrls = (): Array<WorkUrls> =>
	dirs.map((dir) => {
		const path = `static/${dir}`;
		const files = readdirSync(path).filter((file) => file.endsWith(".md"));

		const en = files.find((file) => file.endsWith(".en.md"))?.slice(0, -6);
		const fr = files.find((file) => file.endsWith(".fr.md"))?.slice(0, -6);

		const urls = {
			en: `/works/${en}.json`,
			fr: fr ? `/travaux/${fr}.json` : undefined,
			date: dir,
		};

		return urls;
	});

const findWork = async (slug: string, lang: Lang): Promise<Work | undefined> => {
	const works = getUrls();
	const langs: Lang[] = ["en", "fr"];

	const work = works.find((work) => langs.some((lang) => work[lang]?.endsWith(`/${slug}.json`)));

	if (!work) return;

	const url: string = work[lang]?.endsWith(`/${slug}.json`) ? work[lang] ?? "en" : work.en;
	const validLang = url === work[lang] ? lang : "en";
	const path = `static/${work.date}/${decodeURIComponent(slug)}.${validLang}.md`;

	const alt = validLang === "fr" ? work.en : work.fr;

	return getWork({ lang: validLang, path, alt });
};

export type { Work, WorkUrls, Picture };
export { getWork, getUrls, findWork };
