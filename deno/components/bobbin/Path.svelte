<script>
	/** @type {{d: string, id?: string, position?: import('./data').Point, angle?: number, scale?: number, colour?: string}} */
	let {
		d,
		id,
		position = { x: 0, y: 0 },
		angle = 0,
		scale = 1,
		colour,
	} = $props();

	const transform = `scale(${scale} 1) rotate(${angle}) translate(${position.x} ${position.y})`;
</script>

<path
	id={id ? `shape-${id}` : undefined}
	{transform}
	stroke={colour}
	{d}
	pathLength={12}
/>
