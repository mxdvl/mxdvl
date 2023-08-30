<script>
	import Alternates from "../../dotcom/src/lib/Alternates.svelte";
	import Layout from "../components/Layout.svelte";

	const { id } = { id: 999 };
</script>

<Alternates en="/hi" fr="/allô" />

<Layout>
	<h1>Hi, there!</h1>

	<p>Hello, it’s Max.</p>

	<p>
		A <a href="/allô">bilingual</a> developer &amp, designer in
		<span data-id={id}>cloudy</span>
		London. Currently working at The Guardian.
	</p>

	<p>
		Elegance, simplicity and accessibility guide <a href="/works">my work</a
		>. I love building for the web and making
		<a href="https://github.com/mxdvl">open-source contributions</a>.
	</p>
</Layout>
