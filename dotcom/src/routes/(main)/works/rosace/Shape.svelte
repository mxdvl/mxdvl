<script lang="ts">
	import { writable } from "svelte/store";
	import { active } from "./store";

	export const uid = () => Math.random().toString(36).slice(2);

	const uuid = uid();
	const position = writable<{ x: number; y: number }>({ x: 0, y: 0 });
</script>

<g
	on:mouseenter={() => {
		active.set(uuid);
	}}
	on:mouseleave={() => {
		active.set(undefined);
	}}
>
	<slot {uuid} {position} />
</g>
