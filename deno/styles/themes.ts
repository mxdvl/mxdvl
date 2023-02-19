type Colour<L extends number = number> = `lch(${L}% ${number} ${number})`;

const colours = {
	orange: { 66: "lch(66% 120 54)" },
	teal: { 60: "lch(60% 72 204)" },
	green: {
		98: "lch(98% 6 216)",
		90: "lch(90% 12 216)",
		18: "lch(18% 24 216)",
		9: "lch(9% 24 216)",
	},
} as const satisfies Record<string, Record<number, Colour>>;

const theme_names = ["light", "dark"] as const;
export type Theme = (typeof theme_names)[number];
export const parseTheme = (theme: string): Theme | "default" => {
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
		"--earth": colours.green[18],
		"--clouds": colours.green[98],
		"--skies": colours.green[90],
	},
	dark: {
		"--earth": colours.green[98],
		"--clouds": colours.green[18],
		"--skies": colours.green[9],
	},
};

const getVariables = (theme: keyof typeof colour_themes) =>
	Object.entries(colour_themes[theme])
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");

const root = `:root {
	--ocean: ${colours.teal[60]};
	--glint: ${colours.orange[66]};
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
