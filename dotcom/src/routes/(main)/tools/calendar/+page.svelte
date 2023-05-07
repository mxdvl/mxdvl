<script>
	import Calendar from "./Calendar.svelte";

	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	const year = now.getUTCFullYear();
</script>

<div>
	<Calendar {today} year={year - 1} />

	<Calendar {today} {year} />

	<Calendar {today} year={year + 1} />
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
	}
</style>
