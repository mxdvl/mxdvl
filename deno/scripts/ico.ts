import { Buffer } from "std/io/mod.ts";
import { render } from "resvg";
import {
	ImageMagick,
	IMagickImage,
	initializeImageMagick,
	MagickFormat,
} from "https://deno.land/x/imagemagick_deno@0.0.19/mod.ts";

// Heavily inspired by https://github.com/itgalaxy/favicons/blob/3d200b6e8b9f84adc321a7302b9e7bbb2c7c9103/src/ico.ts#L1

const HEADER_SIZE = 6;
/** https://en.wikipedia.org/wiki/ICO_(file_format)#Header */
const create_header = (sizes: number[]) =>
	new Uint8Array(
		new Uint16Array([
			0, // Reserved. Must always be 0.
			1, // Specifies image type: 1 for icon (.ICO) image, 2 for cursor (.CUR) image. Other values are invalid.
			sizes.length, // Specifies number of images in the file.
		]).buffer,
	);

const DIRECTORY_SIZE = 16; // 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
/** https://en.wikipedia.org/wiki/ICO_(file_format)#Structure_of_image_directory */
const create_directory_entries = (icons: Uint8Array[]) =>
	icons.reduce<{
		directories: Uint8Array[];
		offset: number;
	}>(
		({ directories, offset }, bitmap) => {
			const bytes = bitmap.slice(HEADER_SIZE + 8, HEADER_SIZE + 8 + 4)
				.reduce((acc, curr, index) => acc + curr * Math.pow(2, index * 8));

			const directory = new Uint8Array([
				...bitmap.slice(HEADER_SIZE, HEADER_SIZE + DIRECTORY_SIZE - 4),
				...new Uint8Array(new Uint32Array([offset]).buffer),
			]);

			return { directories: directories.concat(directory), offset: offset + bytes };
		},
		{ directories: [], offset: HEADER_SIZE + DIRECTORY_SIZE * icons.length },
	).directories;

const resize = (image: IMagickImage, size: number) =>
	new Promise<Uint8Array>((resolve) => {
		image.clone((cloned) => {
			cloned.resize(size, size);
			cloned.format = MagickFormat.Ico;
			cloned.write((data) => {
				resolve(new Uint8Array(data));
			}, MagickFormat.Ico);
		});
	});

/** Generate favicon.ico for a given PNG image
 *
 * [header] 6
 * [directories] 16 * number of images
 * [bitmaps] as needed
 */
export const generate_favicon = async (path: string, data: Uint8Array) => {
	await initializeImageMagick();

	ImageMagick.read(data, async (image) => {
		const sizes = [128, 64, 32, 16];

		// Start with the header, 6 bytes long
		const buffer = new Buffer(create_header(sizes));

		// Generate all the icons individually
		const icons = await Promise.all(
			sizes.map((size) => resize(image, size)),
		);

		// Turn full icons into a valid list of directory entries
		const directory_entries = create_directory_entries(icons);

		for (const entry of directory_entries) {
			buffer.write(entry);
		}

		for (const icon of icons) {
			const bitmap = icon.slice(HEADER_SIZE + DIRECTORY_SIZE);
			buffer.write(bitmap);
		}

		const bytes = buffer.bytes();

		return Deno.writeFile(path, bytes);
	});
};

if (import.meta.main) {
	const cmps = new URL("../../cmps", import.meta.url);
	const cwd = await Deno.realPath(cmps);

	const svg = await Deno.readTextFile(`${cwd}/cmps.svg`);
	const png = await render(svg);
	generate_favicon(`${cwd}/build/favicon.ico`, png);
}
