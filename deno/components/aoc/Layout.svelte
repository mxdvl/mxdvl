<script>

	/** @type {{ year: number; day?: number; days: readonly number[], source?: string, children: import('svelte').Snippet }} */
	const {
		year,
		day,
		days,
		source = `https://github.com/mxdvl/mxdvl/blob/main/deno/routes/aoc/${year}/day/${day}.svelte`,
		children,
	} = $props();
</script>

<header>
	<h1>Advent of Code <a href="/aoc/{year}">{year}</a></h1>
	<h2>solutions by <a href="https://www.mxdvl.com/">@mxdvl</a></h2>

	<menu>
		Days:
		{#each days as list_day}
			<li class:current={day === list_day}>
				<a href="/aoc/{year}/day/{list_day}">{list_day}</a>
			</li>
		{/each}
	</menu>

	<hr />

	{#if day}
		<p>
			Get Day {day}
			<a
				href="https://adventofcode.com/{year}/day/{day}"
				target="_blank"
				rel="noopener">problem &nearrow;</a
			>
			&
			<a
				href="https://adventofcode.com/{year}/day/{day}/input"
				target="_blank"
				rel="noopener">input &nearrow;</a
			>
		</p>
		<p class="right">
			See the <a href={source}>source code for this page</a>.
		</p>
	{:else}
		<p>Pick a day &UpDownArrow; above or below</p>
	{/if}
</header>

{@render children()}

<svelte:head>
	<style global>
		:root {
			color-scheme: light dark;

			--red: firebrick;
			--green: forestgreen;
			--blue: cornflowerblue;

			@media (prefers-color-scheme: dark) {
				--red: tomato;
				--green: palegreen;
			}
		}

		::selection {
			background: color-mix(in oklab, var(--blue), transparent 60%);
		}

		a {
			color: inherit;
			text-decoration-thickness: 0.125rem;
		}

		body,
		textarea,
		input {
			font-family: ui-monospace, monospace;
		}

		.right {
			text-align: right;
		}

		textarea {
			display: block;
			font-size: 1rem;
			border: 0.125rem solid var(--blue);
			resize: none;
			padding: 0.125rem;
			caret-color: var(--blue);
		}

		h1,
		h2,
		h3,
		h4 {
			font-size: 1rem;
			margin: 0;
			line-height: 1;
		}

		h1 {
			font-weight: 900;
			color: var(--red);
		}

		h2 {
			font-weight: 500;
			color: var(--green);
		}

		header {
			display: grid;
			grid-template-columns: 1fr 1fr;
			border-bottom: 0.125rem solid var(--blue);
			margin-bottom: 1rem;
		}

		header h2 {
			text-align: right;
		}

		ul {
			list-style-type: disc;
			margin-block: 0.5rem;
			padding-left: 0;
			list-style-position: inside;
		}

		header menu {
			display: flex;
			list-style-type: none;
			padding: 0;
			margin: 0;
			gap: 1ch;
			grid-column-end: span 2;
		}

		header menu .current {
			color: var(--blue);
		}

		header p {
			margin: 0;
			padding: 0;
			padding-bottom: 0.25rem;
			color: var(--green);
		}

		header hr {
			grid-column: 1 / -1;
		}

		hr {
			width: 100%;
			border: none;
			border-top: 0.125rem solid var(--blue);
		}
	</style>
</svelte:head>
