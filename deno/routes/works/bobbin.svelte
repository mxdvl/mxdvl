<script>
	import Bobbin from "../../components/bobbin/Bobbin.island.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Layout lang="en">
<h1>Bobbin</h1>
<h2>delicate circular symmetries</h2>

<noscript>
<h4>Note: JavaScript is required to edit the shape</h4>
</noscript>

<Bobbin />

<article>
	<h1>About <em>Bobbin</em></h1>

	<p>
		Weaving together technologies of the past and future, <em>Bobbin</em> invites us to explore the delicate
		intricacies of circular patterns. Mimicking the delicacy found in traditional crafts, <em>Bobbin</em> leverages Svelte
		to enable us all to become artists. Like modern day lace makers, we are invited to create our own designs and step
		back and admire the possibilities of the web as a design tool. This tool celebrates the advancements we have made
		on seeing speedy results, without compromising on elegance or beauty.
	</p>
	<p>
		All the editing features use the web platform’s native toolset, which made Svelte & SvelteKit an ideal
		environment for development:
	</p>
	<ul>
		<li>The design is encoded as state search parameter</li>
		<li>Undo and redo rely on the web history</li>
		<li>Patterns can be seen without without JavaScript with SSR</li>
		<li>The resulting SVG can be exported as-is and used as the basis for further work</li>
		<li>Animations are built with CSS and the Web Animation API</li>
	</ul>

	<p>
		<a href="https://en.wikipedia.org/wiki/Bobbin_lace#Bobbins">Bobbins</a> are used to hold the thread to create lace,
		which was the inspiration for this tool.
	</p>
</article>
</Layout>
