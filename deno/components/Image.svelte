<script>
	/** @type {string} */
	export let src;

	/** @type {string} */
	export let alt;
	export let ratio = 1;
</script>

<picture style={`--ratio: ${ratio};`}>
	<img src={`/media/${src}`} {alt} />
</picture>

<style>
	picture {
		display: block;
		position: relative;
		color: var(--skies);
		background-image: linear-gradient(
				to bottom right,
				transparent calc(50% - 1px),
				currentColor calc(50% - 1px),
				currentColor calc(50% + 1px),
				transparent calc(50% + 1px)
			),
			linear-gradient(
				to top right,
				transparent calc(50% - 1px),
				currentColor calc(50% - 1px),
				currentColor calc(50% + 1px),
				transparent calc(50% + 1px)
			);
		background-position: calc(0.5 * var(--grid-x)) var(--grid-y);
		background-size: var(--grid-x) var(--grid-y);

		--width: min(var(--columns, 12), 36);
		--ratio: 9;
		width: calc(var(--width) * var(--grid));
		height: calc(var(--width) * var(--ratio) * var(--grid));
		margin: var(--grid) 0;

		transition: color 1.2s;
	}

	picture::after {
		content: "";
		position: absolute;
		top: -1px;
		left: -1px;
		right: -1px;
		bottom: -1px;
		border: 2px solid currentColor;
	}

	picture img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
