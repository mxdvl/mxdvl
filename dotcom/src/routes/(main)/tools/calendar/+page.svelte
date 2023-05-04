<script>
	const now = new Date();

	const year = 2023;

	const from = new Date(year, 0, 1);
	const to = new Date(year + 1, 0, 1);

	const day = 1000 * 3600 * 24;

	const days = Array.from({ length: (to.getTime() - from.getTime()) / day }, (_, day) =>
		new Date(from).setUTCDate(day + 1),
	);

	const first_day = (from.getDay() + 6) % 7;

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	/** @param {Date} date */
	const to_column = (date) => 1 + ((date.getDay() + 6) % 7);
</script>

{from} – {to}

{first_day}

<ul class="calendar">
	<li class="year">{year}</li>
	<li class="day">M</li>
	<li class="day">T</li>
	<li class="day">W</li>
	<li class="day">T</li>
	<li class="day">F</li>
	<li class="day">S</li>
	<li class="day">S</li>
	{#each days as day}
		{@const date = new Date(day)}
		{#if date.getDate() === 1}
			<!-- <li class="month">{months[date.getMonth()]}</li> -->
		{/if}
		<li
			class:first={date.getDate() === 1 && date.getDay() !== 1}
			class:early={date.getDate() <= 7}
			style={`grid-column-start:${to_column(date)}`}
		>
			{date.getDate()}
		</li>
	{/each}
</ul>

<style>
	ul.calendar {
		--size: calc(var(--grid));
		padding: 0;
		margin: 0;
		display: grid;
		list-style-type: none;
		grid-template-columns: repeat(7, var(--size));
		grid-template-rows: repeat(54, var(--size));
		grid-auto-flow: row;
	}

	.calendar li {
		font-size: 0.75em;
		text-align: center;
	}

	.calendar .day {
		font-weight: bold;
		background-color: transparent;
		background-color: var(--skies);
		position: sticky;
		top: 0;
	}

	.calendar .first {
		border-left: 2px solid var(--skies);
		margin-left: -1px;
	}
	.calendar .early {
		border-top: 2px solid var(--skies);
		margin-top: -1px;
	}

	.calendar .year {
		grid-column: 1 / -1;
	}
	.calendar .month {
		grid-column-end: -1;
	}
</style>
