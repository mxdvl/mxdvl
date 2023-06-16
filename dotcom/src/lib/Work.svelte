<script>
	import { cleanDate } from "$lib/Works.svelte";

	/**
	 * @typedef Work
	 * @property {string} [alt]
	 * @property {object} metadata
	 * @property {import("./lang").Lang} metadata.lang
	 * @property {string} metadata.title
	 * @property {string} metadata.date
	 * @property {string} [metadata.at]
	 * @property {string} content
	 */

	/** @type {Work} */
	export let work;
</script>

<section lang={work.metadata.lang}>
	<h2>{work.metadata.title}</h2>
	<h4>
		{cleanDate(work.metadata.date)}
	</h4>

	{@html work.content}
</section>
