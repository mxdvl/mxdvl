const colours = {
	orange: "lch(66% 120 54)",
	teal: "lch(60% 72 204)",
	lightestGreen: "lch(98% 6 216)",
	lightGreen: "lch(90% 12 216)",
	darkGreen: "lch(18% 24 216)",
	darkestGreen: "lch(9% 24 216)",
} as const;

const theme_names = ["light", "dark"] as const;
export type Theme = typeof theme_names[number];
export const getTheme = (theme: string): Theme | "default" => {
	switch (theme) {
		case "dark":
			return "dark";
		case "light":
			return "light";
		default:
			return "default";
	}
};

const colour_themes = {
	light: {
		"--earth": colours.darkGreen,
		"--clouds": colours.lightestGreen,
		"--skies": colours.lightGreen,
	},
	dark: {
		"--earth": colours.lightestGreen,
		"--clouds": colours.darkGreen,
		"--skies": colours.darkestGreen,
	},
};

const getVariables = (theme: keyof typeof colour_themes) =>
	Object.entries(colour_themes[theme])
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");

const root = `:root {
	--ocean: ${colours.teal};
	--glint: ${colours.orange};
}
`;

export const themes = [
	root,
	...theme_names.map((theme) => {
		return `@media (prefers-color-scheme: ${theme}) {
			:root {
				${getVariables(theme)}
			}
		}
	`;
	}),
	...theme_names.map((theme) => {
		return `.${theme} {
			${getVariables(theme)}
		}
	`;
	}),
].join("\n");
