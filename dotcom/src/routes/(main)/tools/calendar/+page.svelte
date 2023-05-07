<script>
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const year = 2023;

	const from = new Date(year, 0, 1);
	const to = new Date(year + 1, 0, 1);

	const day_in_milliseconds = 1000 * 3600 * 24;

	const days = Array.from({ length: (to.getTime() - from.getTime()) / day_in_milliseconds }, (_, day) =>
		new Date(from).setDate(day + 1),
	);

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	/** @param {Date} date */
	const to_column = (date) => 2 + ((date.getDay() + 6) % 7);
</script>

<ul class="calendar">
	<li class="year">{year}</li>
	<li class="day" style="grid-column-start: 2;">M</li>
	<li class="day">T</li>
	<li class="day">W</li>
	<li class="day">T</li>
	<li class="day">F</li>
	<li class="day">S</li>
	<li class="day">S</li>
	{#each days as day}
		{@const date = new Date(day)}
		{#if date.getDate() === 7}
			{@const diff = date.getTime() - from.getTime()}
			<li class="month" style={`grid-row-start: ${4 + Math.floor(diff / day_in_milliseconds / 7)};`}>
				{months[date.getMonth()]}
			</li>
		{/if}
		<li
			class:first={date.getDate() === 1 && date.getDay() !== 1}
			class:early={date.getDate() <= 7}
			class:subdued={date.getTime() !== today.getTime() && date.getDay() !== 1}
			class:today={date.getTime() === today.getTime()}
			style={`grid-column-start:${to_column(date)}`}
		>
			{date.getDate()}
		</li>
	{/each}
</ul>

<style>
	ul.calendar {
		--size: calc(var(--grid) * 2);
		padding: 0;
		margin: 0;
		display: grid;
		list-style-type: none;
		grid-template-columns: repeat(8, var(--size));
		grid-template-rows: repeat(54, var(--size));
		grid-auto-flow: row;
	}

	.calendar li {
		line-height: var(--size);
		text-align: center;
	}

	.calendar .day {
		font-weight: bold;
		background-color: transparent;
		background-color: var(--skies);
		position: sticky;
		top: 0;
	}

	.calendar .subdued {
		color: var(--skies);
	}

	.calendar .first {
		border-left: 2px solid var(--skies);
		margin-left: -1px;
	}
	.calendar .early,
	.calendar .month {
		border-top: 2px solid var(--skies);
		margin-top: -1px;
	}

	.calendar .today {
		color: var(--ocean);
		border: 2px solid var(--ocean);
		margin: -1px;
	}

	.calendar .year {
		grid-column: 1 / -1;
	}

	.calendar .month {
		grid-column-start: 1;
	}
</style>
