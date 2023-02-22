<script lang="ts">
	import { back_and_forth } from "./weaving";

	export let length = 12;
	export let bulge = 4 / 3;
	export let count = 1;

	$: loops = (length: number) => (bulge: number) =>
		[
			"M0,0",
			...back_and_forth([
				`a${length * bulge},${length * bulge} 0 0 1 ${length},0`,
				`a${length * bulge},${length * bulge} 0 0 1 -${length},0`,
			])(count),
		].join("");
</script>

<path d={loops(length)(bulge)} />
