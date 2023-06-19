<script>
	/** @type {number} */
	export let value;
	/** @type {number} */
	export let max;
	/** @type {number} */
	export let min;
</script>

<input type="number" {min} {max} bind:value />

<style>
	input {
		--border: var(--skies);

		outline: 2px solid var(--border);
		outline-offset: -1px;
		border-radius: 1px;

		position: relative;
		display: block;
		padding: 0;
		margin: 0;
		height: var(--grid-double);
		text-align: center;
		border: none;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		line-height: inherit;
		background: transparent;
	}

	input:focus-visible {
		--border: var(--ocean);
	}
</style>
