<script lang="ts">
	export let disabled: boolean = false;
	export let subdued: boolean = false;
	export let type: undefined | "flex" = undefined;
</script>

<button on:click {disabled} data-type={type} class:subdued>
	<slot />
</button>

<style>
	button {
		--border: var(--ocean);

		display: inline;
		position: relative;
		border: none;
		padding: 0 3px;
		margin: 0;
		height: var(--grid-y);
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		line-height: inherit;
		background: transparent;
	}

	button.subdued {
		--border: transparent;
	}

	button.subdued:hover {
		--border: var(--ocean);
	}

	button[data-type="flex"] {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
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

	button:active,
	button:focus {
		--border: var(--glint);
		outline: none;
	}
</style>
