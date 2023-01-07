<script lang="ts">
	import { page } from "$app/stores";
	import { cloud } from "./cloudinary";

	export let src: string;
	export let alt: string;
	export let ratio = 1;

	export let path = $page.url.pathname;

	const GRID_SIZE = 6;

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

	const source = (width: number) => [cloud([path, src].join("/"), width), `${width}w`].join(" ");
</script>

<picture style={`--ratio: ${ratio};`}>
	<img
		{alt}
		srcset={sizes
			.flatMap(([, width]) => [1, 2].map((dpr) => dpr * width * GRID_SIZE))
			.map(source)
			.join(", ")}
		src={source(300)}
		sizes={sizes
			.map(([width, size]) => `(min-width: ${width}px) ${size * GRID_SIZE}px`)
			.concat("96vw")
			.join(", ")}
	/>
</picture>
