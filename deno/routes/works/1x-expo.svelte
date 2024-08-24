<script context="module">
	export const date = "2016-01";
	export const title = "1:X Multidisciplinary Exploration";

	const model = "1x-expo/1x-expo-model.jpg";
	const modelSide = "1x-expo/1x-expo-model-side.jpg";

	export { model, modelSide };
</script>

<script>
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates fr="/travaux/1x-expo" en="/works/1x-expo" />

<Layout>
<section>
	<h2>{title}</h2>
	<h3>{date}</h3>

	<p>
		Exhibition design at the Université de Montréal showcasing the various models and modes of explorations for five
		ongoing projects at Provencher_Roy.
	</p>

	<Image ratio={4 / 6} src={model} alt="model of the expo" />

	<p>
		From the urban scale to furnitures through architecture, the comprehensive design approach of the firm was made
		explicit with various models and tools used across the office.
	</p>

	<Image ratio={4 / 6} src={modelSide} alt="another view of the model" />

	<p>
		<em>
			made at
			<a href="http://provencherroy.ca/">Provencher_Roy</a>
			with Nicolas Demers-Stoddart
		</em>
	</p>
</section>
</Layout>
