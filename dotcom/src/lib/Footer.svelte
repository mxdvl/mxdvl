<script lang="ts">
	import { lang, type Lang } from "./lang";
	import { page } from "$app/stores";
	import Theme from "./Theme.svelte";

	let path: string;
	$: path = $page.url.pathname.replace("/travaux", "/works");

	const search = "https://github.com/search?q=repo%3Amxdvl%2Fmxdvl+in%3Apath+extension%3Amd+extension%3Asvelte";
</script>

<footer class="footer cf">
	{#if $lang == "en"}
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

	<Theme />

	{#if $lang == "fr"}
		<p>
			Inquiet pour votre <a href="/confidentialité">confidentialité</a>?
		</p>
	{:else}
		<p>
			Concerned about <a href="/privacy">privacy</a>?
		</p>
	{/if}

	<p>
		Typo? <a href={`${search}+${path}`}>Edit content</a>.
	</p>

	<p>&copy; MXDVL 2022</p>
</footer>

<style>
	footer {
		position: relative;
		margin: 0;
		padding-top: var(--grid);
	}

	footer::before {
		content: "";
		position: absolute;
		top: -1px;
		width: 100%;
		border-top: 2px solid currentColor;
		color: var(--skies);
		transition: color 1.2s;
	}

	p {
		max-width: 36rem;
	}
</style>
