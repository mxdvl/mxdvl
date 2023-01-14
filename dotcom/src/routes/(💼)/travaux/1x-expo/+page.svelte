<script lang="ts">
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
	import { date, model, modelSide, title } from "../../works/1x-expo/+page.svelte";

	const en = "/works/1x-expo";
</script>

<Alternates fr={$page.url.pathname} {en} />

<section lang="en">
	<h2>{title}</h2>
	<h3>{date}</h3>

	<p>
		Exhibition design at the Université de Montréal showcasing the various models and modes of explorations for five
		ongoing projects at Provencher_Roy.
	</p>

	<Image ratio={4 / 6} picture={model} alt="model of the expo" />

	<p>
		From the urban scale to furnitures through architecture, the comprehensive design approach of the firm was made
		explicit with various models and tools used across the office.
	</p>

	<Image ratio={4 / 6} picture={modelSide} alt="another view of the model" />

	<p>
		<em>
			made at
			<a href="http://provencherroy.ca/">Provencher_Roy</a>
			with Nicolas Demers-Stoddart
		</em>
	</p>
</section>
