<script>
	import Alternates from "../components/Alternates.svelte";
	import Layout from "../components/Layout.svelte";

	const { id } = { id: 999 };
</script>

<Alternates en="/hi" fr="/allô" />

<Layout lang="en" url={new URL("https://www.mxdvl.com/hi")}>
<h1>Hi there, it’s <strong>Max</strong>!</h1>

<p>
	A <a href="/allô">bilingual</a> developer &amp, designer in
	<span data-weather-id={id}>“cloudy”</span>
	London.
</p>

<p>
	Currently building a <a href="https://www.hometrack.com/data-services/data-hub/"
		>web data hub at Hometrack</a
	>. Previously contributed to
	<a href="https://www.theguardian.com/uk">the Guardian’s website</a>. You can read more about my professional
	journey
	<a href="/profile">on my profile</a>.
</p>

<p>I’m proud of these recents achievements and projects:</p>

<ul>
	<li>Deploying a real-time data collection pipeline focussed on privacy in April 2024</li>
	<li>
		Visualisating the <a href="https://observablehq.com/@mxdvl/equinoxe">journey of Equinoxe</a>
		towards the
		<a href="https://transatqsm.com">Transat Québec–St-Malo</a>
	</li>
	<li>
		<a href="/works/bobbin">Bobbin</a>, a tool for making intricate symmetries
	</li>
	<li>
		<a href="https://mxdvl.github.io/gudrid/">Gudrid</a>, a tool to explore Guardian content
	</li>
	<li>
		The launch of <a href="https://github.com/guardian/typescript-school">TypeScript school</a>, which helps all
		developers be on the same page in November 2023
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
	<li>
		Kept tinkering with ideas on <a href="https://codepen.io/mxdvl">CodePen</a>
		and
		<a href="https://www.mxdvl.com/aoc/2023">Advent of Code 2023</a>
	</li>
</ul>
</Layout>
