<script lang="ts">
	import type { Work } from "$content/lib/works";
	import WorkComponent from "$lib/Work.svelte";

	export let work: Work;
</script>

<WorkComponent {work} />
