<script lang="ts">
	import WorkComponent from "$lib/Work.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	const { work } = data;
</script>

<WorkComponent {work} />
