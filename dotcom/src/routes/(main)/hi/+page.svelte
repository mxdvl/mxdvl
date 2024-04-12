<script>
	import { getCondition } from "$lib/weather.js";
	import Alternates from "$lib/Alternates.svelte";

	export let data;

	const { feels_like, id } = data;
</script>

<Alternates en="/hi" fr="/allô" />

<h1>Hi there, it’s <strong>Max</strong>!</h1>

<h2>
	Designer & developer in
	<span data-id={id}>{feels_like > 300 ? "boiling" : getCondition(id, "en")}</span>
	London.
</h2>

<!-- Feels like {feels_like}K</p> -->

<p>
	Currently building <a href="https://www.theguardian.com/uk">the Guardian</a>’s website. You can read more about my
	professional journey
	<a href="/profile">on my profile</a>.
</p>

<p>I’m proud of these recents achievements and projects:</p>

<ul>
	<li>Deploying a real-time data collection pipeline focussed on privacy in April 2024</li>
	<li><a href="https://mxdvl.github.io/gudrid/">Gudrid</a>, a tool to explore Guardian content</li>
	<li>
		The launch of <a href="https://github.com/guardian/typescript-school">TypeScript school</a>, which helps all
		developers be on the same page in November 2023.
	</li>
	<li>
		<a href="https://www.theguardian.com/info/2023/oct/24/standardisation-the-merit-of-consistent-patterns"
			>“Standardisation: the merit of consistent patterns”</a
		>, an engineering blog post in October 2023
	</li>
	<li>
		Delivering an <a href="https://github.com/guardian/dotcom-rendering/pull/9024"
			>adapted website experience for users experiencing poor page performance</a
		>
	</li>
	<li>Mentored four fellow engineers in 2023, which help me grow along with them</li>
	<li><a href="/works/bobbin">Bobbin</a>, a tool for making intricate symmetries</li>
	<li>
		<a href="https://github.com/guardian/csnx/pull/850">20&times; speed improvement</a> on internal relative time method
	</li>
</ul>

<style>
	ul {
		padding-left: var(--grid);
		margin: 0;
	}

	li {
		padding-bottom: var(--grid-y);
	}
</style>
