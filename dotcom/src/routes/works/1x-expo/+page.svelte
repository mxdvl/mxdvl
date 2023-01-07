<script context="module" lang="ts">
	export const date = "2016-01";
	export const title = "1:X Multidisciplinary Exploration";
</script>

<script lang="ts">
	import { page } from "$app/stores";

	import Image from "$lib/Image.svelte";
	import Alternates from "../../../lib/Alternates.svelte";
</script>

<Alternates en={$page.url.pathname} fr="/travaux/1x-expo" />

<section>
	<h2>{title}</h2>
	<h3>{date}</h3>

	<p>
		Exhibition design at the Université de Montréal showcasing the various models and modes of explorations for five
		ongoing projects at Provencher_Roy.
	</p>

	<Image ratio={4 / 6} src="1x-expo-model.jpg" alt="model of the expo" />

	<p>
		From the urban scale to furnitures through architecture, the comprehensive design approach of the firm was made
		explicit with various models and tools used across the office.
	</p>

	<Image ratio={4 / 6} src="1x-expo-model-side.jpg" alt="another view of the model" />

	<p>
		<em>
			_made at
			<a href="http://provencherroy.ca/">Provencher_Roy</a>
			with Nicolas Demers-Stoddart_
		</em>
	</p>
</section>
