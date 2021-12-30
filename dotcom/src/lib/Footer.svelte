<script lang="ts">
	import type { Lang } from "./lang";
	import Theme from "./Theme.svelte";

	export let lang: Lang;
</script>

<footer class="footer cf" role="contentinfo">
	{#if lang == "en"}
		<p>Hello, it’s Max.</p>

		<p>
			A <a href="/allo">bilingual</a> developer &amp; designer in
			<em>cloudy</em>
			London. Currently working at The Guardian.
		</p>

		<p>
			Elegance, simplicity and accessibility guide <a href="/works">my work</a>. I love building for the web and
			making
			<a href="https://github.com/mxdvl">open-source contributions</a>.
		</p>

		<p>
			Online since 2007.<br />
			Get in touch via <a href="mailto:hi@mxdvl.com">email</a>
			or <a href="https://t.me/mxdvl">telegram</a>.<br />
			Pronouns: he/him.
		</p>

		<Theme {lang} />
	{:else}
		<p>Allô, c’est Max.</p>

		<p>
			Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
			<em>nuageuse</em>. Je travaille actuellement chez The Guardian.
		</p>

		<p>
			<a href="/travaux">Mon travail</a>
			s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
			<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
		</p>

		<p>
			En ligne depuis 2007.<br />
			Faites-moi signe par <a href="mailto:allo@mxdvl.com">courriel</a>, ou
			<a href="https://t.me/mxdvl">telegram</a>.<br />
			Pronoms: il/lui.
		</p>

		<Theme {lang} />
	{/if}
	<p>&copy; MXDVL 2021</p>
</footer>

<style>
	footer {
		border-top: 2px solid var(--skies);
		margin-top: -2px;
		padding-top: var(--grid);
	}

	p {
		max-width: 36rem;
	}
</style>
