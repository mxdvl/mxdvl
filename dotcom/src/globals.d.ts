/// <reference types="@sveltejs/kit" />

type Picture = import("vite-imagetools").Picture

// images override
declare module "*.png" {
	const src: Picture;
	export default src;
}
declare module "*.jpg" {
	const src: Picture;
	export default src;
}
declare module "*.jpeg" {
	const src: Picture;
	export default src;
}
declare module "*.jfif" {
	const src: Picture;
	export default src;
}
declare module "*.pjpeg" {
	const src: Picture;
	export default src;
}
declare module "*.pjp" {
	const src: Picture;
	export default src;
}
declare module "*.gif" {
	const src: Picture;
	export default src;
}
declare module "*.svg" {
	const src: Picture;
	export default src;
}
declare module "*.ico" {
	const src: Picture;
	export default src;
}
declare module "*.webp" {
	const src: Picture;
	export default src;
}
declare module "*.avif" {
	const src: Picture;
	export default src;
}
