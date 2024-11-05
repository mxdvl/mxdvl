import { render } from "resvg";
import { ImageMagick, IMagickImage, initialize as initialise, MagickFormat } from "image-magick";

// Heavily inspired by https://github.com/itgalaxy/favicons/blob/3d200b6e8b9f84adc321a7302b9e7bbb2c7c9103/src/ico.ts#L1

const HEADER_SIZE = 6;

/** generate a low-endian array for the value */
const to_array = (value: number, size: number) => {
	if (value >= Math.pow(2, 8 * size + 1)) throw RangeError(`The number ${value} does not fit in ${size} bytes`);
	return Array.from({ length: size }, (_, position) => Math.floor(value / Math.pow(2, 8 * position)));
};

/** extract a value from a low-endian array */
const from_array = (array: Uint8Array) => array.reduce((acc, curr, index) => acc + curr * Math.pow(2, index * 8));

const concatenate = (prev: Uint8Array, curr: Uint8Array) => new Uint8Array([...prev, ...curr]);

interface HeaderOptions {
	type: "icon" | "cursor";
	number_of_images: number;
}
/** https://en.wikipedia.org/wiki/ICO_(file_format)#Header */
const create_header = ({ number_of_images, type }: HeaderOptions) =>
	new Uint8Array([
		0,
		type === "cursor" ? 2 : 1,
		number_of_images,
	].flatMap((value) => to_array(value, 2)));

const DIRECTORY_SIZE = 16; // 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
/** https://en.wikipedia.org/wiki/ICO_(file_format)#Structure_of_image_directory */
const create_directory_entries = (icons: readonly Uint8Array[]) =>
	icons.reduce(
		({ directory, offset }, individual_directory) => {
			const all_but_offset = individual_directory.slice(0, -4);
			const bytes = from_array(all_but_offset.slice(-4));

			return {
				directory: new Uint8Array([
					...directory,
					...all_but_offset,
					...to_array(offset, 4),
				]),
				offset: offset + bytes,
			};
		},
		{
			directory: new Uint8Array(),
			offset: HEADER_SIZE + DIRECTORY_SIZE * icons.length,
		},
	).directory;

const resize = (image: IMagickImage, size: number) =>
	new Promise<readonly [directory: Uint8Array, image: Uint8Array]>((resolve) => {
		image.clone((cloned) => {
			cloned.resize(size, size);
			cloned.write(MagickFormat.Ico, (data) => {
				resolve([
					data.slice(HEADER_SIZE, HEADER_SIZE + DIRECTORY_SIZE),
					data.slice(HEADER_SIZE + DIRECTORY_SIZE),
				]);
			});
		});
	});

/**
 * ## Generate favicon.ico for a given PNG image
 *
 * A replacement for `-define icon:auto-resize=64,32,16`
 *
 * @example
 *
 * deno run -A ./ico.ts input.svg output.ico
 */
export const generate_favicon = async (path: string, data: Uint8Array) => {
	await initialise();

	ImageMagick.read(data, async (image) => {
		const sizes = [16, 32, 64, 128] as const;

		const header = create_header({ number_of_images: sizes.length, type: "icon" });

		// Generate all the icons individually
		const icons = await Promise.all(
			sizes.map((size) => resize(image, size)),
		);
		const directories = icons.map(([directory]) => directory);
		const images = icons.map(([, image]) => image).reduce(concatenate);

		const directory = create_directory_entries(directories);

		return Deno.writeFile(
			path,
			new Uint8Array([
				...header,
				...directory,
				...images,
			]),
		);
	});
};

if (import.meta.main) {
	const [input, output] = Deno.args;
	if (!input || !output) {
		console.warn("You need to pass an input and output");
		Deno.exit(1);
	}

	const svg = await Deno.readTextFile(input);
	const png = await render(svg);
	generate_favicon(output, png);
}
