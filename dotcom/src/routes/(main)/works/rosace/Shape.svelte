<script lang="ts">
	import { writable } from "svelte/store";

	export const uid = () => Math.random().toString(36).slice(2);

	const uuid = uid();
	const position = writable<{ x: number; y: number }>({ x: 0, y: 0 });
</script>

<g data-uuid={uuid}>
	<slot {uuid} {position} />
</g>
