<script lang="ts">
	export let path: `/content/${string}`;
	export const cdn = "https://res.cloudinary.com/mxdvl/image/upload";
	export const sizes = [300, 600, 900, 1200, 1800, 2400];
</script>

<figure>
	<img
		width="900"
		src={`${cdn}/w_300/${path}`}
		srcset={sizes.map((size) => `${cdn}/w_${size}/${path} ${size}w`).join(", ")}
		sizes="900px"
		alt=""
	/>
</figure>

<style>
	figure {
		margin: 0;
	}
</style>
