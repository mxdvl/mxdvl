/// <reference types="@sveltejs/kit" />

declare module "./*.jpg" {
	const src: import("vite-imagetools").Picture;
	export default src;
}

declare module "./*.png" {
	const src: import("vite-imagetools").Picture;
	export default src;
}
