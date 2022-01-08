<script lang="ts">
	import type { Lang } from "./lang";
	import { page } from "$app/stores";
	import Theme from "./Theme.svelte";

	export let lang: Lang;
	let path: string;
	$: path = $page.path.replace("/travaux", "/works");
</script>

<footer class="footer cf" role="contentinfo">
	{#if lang == "en"}
		<p>
			Online since 2007.<br />
			Get in touch via <a href="mailto:hi@mxdvl.com">email</a>
			or <a href="https://t.me/mxdvl">telegram</a>.<br />
			Pronouns: he/him.
		</p>
	{:else}
		<p>
			En ligne depuis 2007.<br />
			Faites-moi signe par <a href="mailto:allo@mxdvl.com">courriel</a>, ou
			<a href="https://t.me/mxdvl">telegram</a>.<br />
			Pronoms: il/lui.
		</p>
	{/if}

	<Theme {lang} />

	<p>
		Typo? <a
			href={`https://github.com/search?q=repo%3Amxdvl%2Fmxdvl+in%3Apath+extension%3Amd+extension%3Asvelte+${path}`}
			>Edit content</a
		>.
	</p>

	<p>&copy; MXDVL 2022</p>
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
