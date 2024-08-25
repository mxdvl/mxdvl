<script>
	import Calendar from "../../components/Calendar.svelte";
	import Layout from "../../components/Layout.svelte";

	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	const year = now.getUTCFullYear();

	const lang = "fr";
</script>

<Layout {lang}>
<div>
	<Calendar {lang} {today} year={year - 1} />

	<Calendar {lang} {today} {year} />

	<Calendar {lang} {today} year={year + 1} />
</div>
</Layout>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--grid-x);
	}
</style>
