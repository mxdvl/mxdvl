export type Lang = "en" | "fr";

const frenchPages = ["allo", "profil", "travaux"];

export const pathLang = (path: string): Lang => (frenchPages.find((page) => path.split("/").includes(page)) ? "fr" : "en");
