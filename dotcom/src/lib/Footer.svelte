<script lang="ts">
	import type { Lang } from "./lang";
	import Theme from "./Theme.svelte";

	export let lang: Lang;
</script>

<footer class="footer cf" role="contentinfo">
	<Theme />

	{#if lang == "en"}
		<p class="footer-copyright">
			Hello, it’s Max.<br />
			<br />
			A <a href="/allo">bilingual</a> developer &amp; designer in
			<em>cloudy</em>
			London. Currently working at The Guardian.<br />
			<br />
			Elegance, simplicity and accessibility drive <a href="/works">my work</a>. I love building for the web and
			making
			<a href="https://github.com/mxdvl">open-source contributions</a>.<br />
			<br />
			Get in touch via <a href="mailto:hi@mxdvl.com">email</a>,
			<a href="tel:+447491245727">phone</a>
			or <a href="https://t.me/mxdvl">telegram</a>. He/him.<br />
			<br />
			Online since 2007—<a href="https://www.mxdvl.com/colophon">colophon</a>.
		</p>
	{:else}
		<section class="footer-copyright">
			<p>Allô, c’est Max.</p>

			<p>
				Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
				<em>nuageuse</em>.
			</p>

			<p>Je bosse chez The Guardian.</p>

			<p>
				En ligne depuis 2007—<a href="https://www.mxdvl.com/colophon">colophon</a>.
			</p>
		</section>
	{/if}
	<div class="wrap wide" />
</footer>

<style>
	footer {
		border-top: 2px solid var(--skies);
		margin-top: -2px;
		padding-top: var(--grid);
	}
</style>
