export type Lang = "en" | "fr";

const frenchPages = [
	// Keep as multi-line array
	"allô",
	"erreur",
	"profil",
	"travaux",
	"outils",
	"confidentialité",
];

export const pathLang = (path: string): Lang =>
	frenchPages.find((page) => path.split("/").includes(encodeURIComponent(page))) ? "fr" : "en";
