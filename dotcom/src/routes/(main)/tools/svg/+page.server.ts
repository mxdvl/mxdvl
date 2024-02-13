import SVGPathCommander from "svg-path-commander";

export const load = ({ url }) => {
	const d = url.searchParams.get("d");
	const s = Number(url.searchParams.get("s"));

	return {
		path: d && SVGPathCommander.isValidPath(d) ? d : undefined,
		selected: Number.isInteger(s) ? s : -1,
	};
};
