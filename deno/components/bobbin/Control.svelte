<script>
	import { fly } from "svelte/transition";
	import Button from "../Button.svelte";
	import { uid, bobbin, toggle } from "./store.svelte.js";

	/** @typedef {import('./data.js').Pattern} Pattern */

	/** @type {{ pattern: Pattern }} */
	let { pattern } = $props();

	const current = $derived(bobbin.selected === pattern.id);

	const toggle_selected = () => toggle(pattern.id);

	/** @param {KeyboardEvent} event */
	const handle_keydown = (event) => {
		switch (event.key) {
			case "ArrowRight": {
				event.preventDefault();
				pattern.position.x++;
				break;
			}
			case "ArrowLeft": {
				event.preventDefault();
				pattern.position.x--;
				break;
			}
			case "ArrowUp": {
				event.preventDefault();
				pattern.position.y++;
				break;
			}
			case "ArrowDown": {
				event.preventDefault();
				pattern.position.y--;
				break;
			}
			case "Backspace": {
				event.preventDefault();

				bobbin.patterns.delete(pattern.id);
				bobbin.selected = "";

				break;
			}
		}
	};
</script>

<h3>
	<Button on:click={toggle_selected} type={"flex"} subdued={true}>
		#path-{pattern.id ?? "?"}

		{#if current}
			<span class="close">&times;</span>
		{:else}
			<span class="open">○</span>
		{/if}
	</Button>
</h3>

{#if current}
	<ul
		class="further-controls"
		transition:fly|local={{ y: -12, duration: 240 }}
	>
		<li>
			Count
			<button
				onclick={() => {
					pattern.count = Math.max(1, pattern.count - 1);
				}}>-</button
			>
			<input
				type="number"
				bind:value={pattern.count}
				min="3"
				max="120"
				step="1"
			/>
			<button
				onclick={() => {
					pattern.count = Math.min(120, pattern.count + 1);
				}}>+</button
			>
		</li>

		<li>
			<label>
				Mirror
				<input type="checkbox" bind:checked={pattern.mirror} />
			</label>
		</li>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<li tabindex={0} onkeydown={handle_keydown}>
			{Math.round(pattern.position.x)},{Math.round(pattern.position.y)}
		</li>

		<li class="path">
			<textarea bind:value={pattern.d} cols="20" rows="4"></textarea>
		</li>

		<li class="buttons">
			<Button
				on:click={() => {
					const id = uid();
					const { x, y } = pattern.position;
					const reactive_pattern = $state({
						...pattern,
						id,
						position: { x: x + 12, y },
					});
					bobbin.patterns.set(id, reactive_pattern);
					bobbin.selected = id;
				}}>duplicate</Button
			>
			<Button
				on:click={() => {
					bobbin.selected = "";
					bobbin.patterns.delete(pattern.id);
				}}>remove</Button
			>
		</li>
	</ul>
{/if}

<style>
	h3 {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5rem;
		padding: 3px;
		position: sticky;
		top: 0;
		background-image: linear-gradient(
			to bottom,
			var(--clouds) 60%,
			transparent
		);
		z-index: 3;
	}

	.open {
		color: var(--skies);
	}

	.close {
		color: var(--ocean);
	}

	ul.further-controls {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 3px;
		gap: 12px;
		flex-direction: row;
		flex-wrap: wrap;
		list-style-type: none;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.path {
		flex-basis: 50%;
	}

	input[type="number"] {
		max-width: 3rem;
	}

	textarea {
		display: block;
		font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo,
			Consolas, "DejaVu Sans Mono", monospace;
		background-color: inherit;
		resize: none;
		font-size: inherit;
		border: 2px solid var(--skies);
		color: inherit;
	}

	@media (max-width: 342px) {
		.buttons {
			flex-direction: row;
		}
	}
</style>
