import * as lz from "lz-string";
export interface Point {
	x: number;
	y: number;
}

export interface Pattern {
	id: string;
	count: number;
	mirror: boolean;
	position: Point;
	d: string;
}

const divider = "|";

const pattern_to_string = ({ id, count, mirror, position, d }: Pattern) =>
	[id, count, mirror ? "M" : "_", Math.round(position.x), Math.round(position.y), d].join(divider);

/** Serialise patterns definition */
export const patterns_to_string = (patterns: Pattern[]) =>
	lz.compressToEncodedURIComponent(JSON.stringify(patterns.map(pattern_to_string)));

const string_to_pattern = (pattern: string): Pattern => {
	const [id, count, mirror, x, y, d] = pattern.split(divider);
	if (id && count && mirror && x && y && d) {
		return { id, count: Number(count), mirror: mirror === "M", position: { x: Number(x), y: Number(y) }, d };
	} else {
		throw new Error(`Invalid pattern: ${pattern}`);
	}
};

/** De-serialise pattern definition */
export const string_to_patterns = (patterns: string): Pattern[] => {
	try {
		const array = JSON.parse(lz.decompressFromEncodedURIComponent(patterns));

		return Array.isArray(array) ? array.map(string_to_pattern) : [];
	} catch (error) {
		console.error(error);
		return [];
	}
};
