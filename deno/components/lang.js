/** @typedef {typeof langs[number]} Lang */
export const langs = /** @type {const} */ (["en", "fr"]);

const frenchPages = /** @type {const} */ ([
	// Keep as multi-line array
	"allô",
	"erreur",
	"profil",
	"travaux",
	"outils",
	"confidentialité",
]);

/**
 * @param {string} path
 * @returns {Lang}
 */
export const pathLang = (path) =>
	frenchPages.find((page) => path.split("/").includes(encodeURIComponent(page))) ? "fr" : "en";
