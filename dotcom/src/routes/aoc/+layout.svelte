<header>
	<h1>Advent of Code</h1>
	<h2>solutions by <a href="/">@mxdvl</a></h2>
</header>

<slot />

<style global>
	:root {
		--red: darkred;
		--green: darkgreen;
		--blue: rgb(46, 125, 194);
	}

	body,
	textarea,
	input {
		font-family: ui-monospace, monospace;
	}

	textarea {
		font-size: 1rem;
		border: 0.5ch solid var(--blue);
		resize: none;
		padding: 0.5ch;
	}

	h1,
	h2,
	h3,
	h4 {
		font-size: 2rem;
		margin: 0;
		line-height: 1;
	}

	h1 {
		color: var(--red);
	}

	h2 {
		font-weight: 500;
		color: var(--green);
	}

	h2 a {
		color: inherit;
	}

	header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-bottom: 0.5ch solid var(--blue);
		margin-bottom: 1rem;
	}
</style>
