/** @typedef {"light" | "dark"} Theme  */

/** @type {(): Theme} */
const systemTheme = () =>
	window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";

/** @type {(theme: Theme): void} */
export const setTheme = (theme) => {
	document.body.classList.add("themed");

	const newTheme = theme === systemTheme() ? "default" : theme;
	switch (newTheme) {
		case "light":
		case "dark":
			localStorage.setItem("theme", newTheme);
			break;
		case "default":
			localStorage.removeItem("theme");
			break;
	}

	console.info("theme set to", newTheme);

	const { classList } = document.documentElement;
	classList.remove("light", "dark", "default");
	classList.add(newTheme);
};
