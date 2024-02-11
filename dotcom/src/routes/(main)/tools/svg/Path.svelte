<script>
	export let visualise = false;
	/** @type {string} */
	export let d;

	const marker = visualise ? "url(#dot)" : undefined;
</script>

<marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
	<circle cx="5" cy="5" r="3" fill="var(--glint)" stroke="none" />
</marker>

<path {d} marker-start={marker} marker-mid={marker} marker-end={marker} />

<style>
	path {
		stroke: var(--earth);
	}
</style>
