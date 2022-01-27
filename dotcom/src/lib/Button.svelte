<script lang="ts">
	export let disabled: boolean;
</script>

<button on:click {disabled}>
	<slot />
</button>

<style>
	button {
		--border: var(--ocean);

		position: relative;

		display: inline;
		border: none;
		padding: 0 3px;
		margin: 0;
		height: var(--grid);
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		line-height: inherit;
		background: transparent;
	}

	button::before {
		content: "";
		position: absolute;
		inset: -1px;

		border-radius: 2px;
		border: 2px solid var(--border);
	}

	button:disabled::before {
		border-color: var(--skies);
	}

	button:enabled:hover {
		cursor: pointer;
		color: var(--border);
	}

	button:active {
		--border: var(--glint);
	}

	button:focus {
		outline: var(--glint) solid 2px;
		outline-offset: 2px;
	}
</style>
