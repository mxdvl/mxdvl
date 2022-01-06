export type Lang = "en" | "fr";

const frenchPages = [
	// Keep each on its own line
	"allo",
	"erreur",
	"profil",
	"travaux",
];

export const pathLang = (path: string): Lang =>
	frenchPages.find((page) => path.split("/").includes(page)) ? "fr" : "en";
