<script>
	import Calendar from "../../tools/calendar/Calendar.svelte";

	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	const year = now.getUTCFullYear();
</script>

<div>
	<Calendar lang="fr" {today} year={year - 1} />

	<Calendar lang="fr" {today} {year} />

	<Calendar lang="fr" {today} year={year + 1} />
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--grid-x);
	}
</style>
