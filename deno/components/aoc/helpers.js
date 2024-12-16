/** @typedef {`${number},${number}`} Coordinates */

/**
 * @param {string} input a 2D representation of items
 * @param {(character: string) => string | undefined} input a 2D representation of items
 * @returns {ReadonlyMap<Coordinates, string>}
 */
export function create_map(input, remap = identity) {
	return new Map(
		input
			.split("\n")
			.flatMap((line, y) =>
				line.split("").flatMap((letter, x) => {
					const remapped = remap(letter);
					return remapped ? [[`${x},${y}`, remapped]] : [];
				})
			),
	);
}

/**
 * @param {Coordinates} coordinates
 * @returns {{x: number, y: number }}
 */
export function parse_coordinates(coordinates) {
	const [x = -1, y = -1] = coordinates.split(",").map((string) => parseInt(string, 10));
	return { x, y };
}

/**
 * @param {Object} coordinates
 * @param {number} coordinates.x
 * @param {number} coordinates.y
 * @returns {Coordinates}
 */
export function format_coordinates({ x, y }) {
	return `${x},${y}`;
}

/** @type {(coord: string) => coord is Coordinates} */
export function is_coordinates(coord) {
	return !!coord.match(/^-?\d+,-?\d+$/);
}

/** @type {(a: number, b: number) => number}*/
export const sum = (a, b) => a + b;

/** @type {(a: number, b: number) => number}*/
export const product = (a, b) => a * b;

/**
 * @template T
 * @param {T} _
 */
function identity(_) {
	return _;
}

export const arrows = "→←↑↓↖↗↘↙";
