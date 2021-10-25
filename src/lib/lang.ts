import { writable } from "svelte/store";

export const languageStore = writable<Lang>("en");

languageStore.subscribe((value) => {
	console.log("Language set to", value);
});

export type Lang = "en" | "fr";
