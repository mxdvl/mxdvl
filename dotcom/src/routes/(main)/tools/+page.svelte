<script>
	import Alternates from "$lib/Alternates.svelte";

	const tools = /** @type {const} */ (["pace", "factors", "calendar", "slideshow", "svg"]);
</script>

<Alternates en="/tools" fr="/outils" />

<h2>Some tools!</h2>

<ul>
	{#each tools as tool}
		<li><a href={`/tools/${tool}`}>{tool}</a></li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
	}

	li {
		display: block;
		padding: var(--grid);
	}

	a {
		--frame: var(--skies);
		display: block;
		position: relative;
		width: calc(3 * var(--grid-double));
		height: var(--grid-double);
		text-decoration: none;
		text-align: center;
		line-height: var(--grid-double);
	}

	a:hover {
		--frame: var(--border);
	}

	a::before {
		content: "";
		border: 2px solid var(--frame);
		position: absolute;
		inset: -1px;
	}
</style>
