<script context="module">
	/**
	 * @param {import("./lang.js").Lang} lang
	 * @param {string} [url]
	 */
	const getTitle = (lang, url) => {
		const missing = lang === "en" ? "(missing title)" : "(titre manquant)";
		// TODO: make it nice
		return (
			url
				?.replace(".json", "")
				.split("/")
				.slice(-1)[0]
				?.split("-")
				.map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
				.join(" ") ?? missing
		);
	};

	/** @param {string} date */
	export const cleanDate = (date) => new Date(date).toISOString().slice(0, 7);
</script>

<script>
	/** @typedef {import('./lang.js').Lang} Lang */

	/** @type {string[]} */
	export let works;
	/** @type {Lang} */
	export let lang;
</script>

<ul>
	{#each works as work}
		<li>
			<a href={work}>
				<h3>
					{getTitle(lang, work)}
				</h3>
				<!-- <h4>
					{cleanDate(work.date)}
				</h4> -->
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		--columns: 1;
		--width: 100%;
		display: grid;
		padding: 0;
		margin: 0;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: calc(var(--columns) * var(--grid));
	}

	li {
		display: block;
		height: calc(3 * var(--grid-double) + 2px);
		box-sizing: border-box;
		margin: -1px;
	}

	li a {
		display: block;
		box-sizing: border-box;
		text-decoration: none;
		height: 100%;
		padding: 0.5rem;
		border-radius: 1px;
		border: 2px solid;
		border-color: var(--skies);
	}

	li h3 {
		line-height: var(--grid);
	}

	li a:hover {
		border-color: currentColor;
	}

	li a:active {
		border-color: var(--glint);
	}

	@media screen and (min-width: 620px) {
		ul {
			--columns: 2;
		}
	}

	@media screen and (min-width: 960px) {
		ul {
			--columns: 3;
		}
	}

	@media screen and (min-width: 1314px) {
		ul {
			--columns: 4;
		}
	}
</style>
