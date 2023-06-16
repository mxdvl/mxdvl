import { writable } from "svelte/store";

/** @typedef {'en' | 'fr'} Lang */

const frenchPages = /** @type {const} */ ([
	// Keep as multi-line array
	"allô",
	"erreur",
	"profil",
	"travaux",
	"outils",
	"confidentialité",
]);

/** @type {import("svelte/store").Writable<Lang>} */
export const lang = writable("en");

/**
 * @param {string} path
 * @returns {Lang}
 */
export const pathLang = (path) =>
	frenchPages.find((page) => path.split("/").includes(encodeURIComponent(page))) ? "fr" : "en";
