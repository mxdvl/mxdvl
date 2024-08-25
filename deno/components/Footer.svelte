<script>
	/** @typedef {import('./lang.js').Lang} Lang */

	/** @type {Lang} */
	export let lang;

	/** @type {URL} */
	export let url;

	/** @type {string} */
	const path = url.pathname.replace("/travaux", "/works");
</script>

<footer class="footer cf">
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
			Faites-moi signe via <a href="mailto:allo@mxdvl.com">courriel</a>, ou
			<a href="https://t.me/mxdvl">telegram</a>.<br />
			Pronoms: il/lui.
		</p>
	{/if}

	{#if lang == "fr"}
		<p>
			Inquiet pour votre <a href="/confidentialité">confidentialité</a>?
		</p>
	{:else}
		<p>
			Concerned about <a href="/privacy">privacy</a>?
		</p>
	{/if}

	<p>
		Typo? <a
			href={new URL(
				`search?${new URLSearchParams({
					type: "code",
					q: ["repo:mxdvl/mxdvl", "path:/deno/routes/.+\\.svelte/"].join(" "),
				}).toString()}`,
				"https://github.com/",
			).href}
			>{#if lang == "fr"}
				Suggérer une modification
			{:else}
				Propose an edit
			{/if}</a
		>.
	</p>

	<p>&copy; MXDVL 2007-{new Date().getFullYear()}</p>
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
