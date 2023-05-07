<script>
	/** @type {Date} */
	export let today;
	/** @type {number} */
	export let year = today.getUTCFullYear();

	const from = new Date(Date.UTC(year, 0, 1));
	const to = new Date(Date.UTC(year + 1, 0, 1));

	const day_in_milliseconds = 1000 * 3600 * 24;

	const days = Array.from({ length: (to.getTime() - from.getTime()) / day_in_milliseconds }, (_, day) =>
		new Date(from).setUTCDate(day + 1),
	);

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	/** @param {Date} date */
	const to_column = (date) => 2 + ((date.getUTCDay() + 6) % 7);

	/** @param {Date} date */
	const to_week = (date) => {
		const week_start = to_column(from) - 1;
		const diff = (date.getTime() - from.getTime()) / day_in_milliseconds;
		const days_since_first_monday = week_start + diff - 1;
		return Math.floor(days_since_first_monday / 7);
	};
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
		{#if date.getUTCDate() === 7}
			<li class="month" style={`grid-row-start: ${3 + to_week(date)};`}>
				{months[date.getMonth()]}
			</li>
		{/if}
		<li
			class:first={date.getUTCDate() === 1 && date.getUTCDay() !== 1}
			class:early={date.getUTCDate() <= 7}
			class:subdued={date.getTime() !== today.getTime() && date.getUTCDay() !== 1}
			class:today={date.getTime() === today.getTime()}
			style={`grid-column-start:${to_column(date)}`}
		>
			{date.getUTCDate()}
		</li>
	{/each}
</ul>

<style>
	.calendar {
		--size: calc(var(--grid) * 2);
		padding: 0;
		margin: 0;
		display: grid;
		list-style-type: none;
		grid-template-columns: repeat(8, var(--size));
		grid-template-rows: repeat(56, var(--size));
		grid-auto-flow: row;
	}

	@media (max-width: 342px) {
		.calendar {
			--size: calc(var(--grid) * 1.5);
		}
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
