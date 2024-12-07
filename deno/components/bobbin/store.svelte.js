import { SvelteMap } from "svelte/reactivity";
import { loop } from "./weaving.js";

/** @typedef {import("./data.js").Pattern} Pattern */

export const uid = () => Math.random().toString(36).slice(2);

export const state = $state({
	selected: "",
	debug: false,
	animate: false,
	/** @type {SvelteMap<string, Pattern>} */
	patterns: new SvelteMap(),
});

/** @returns {Pattern | undefined} */
export function get_current() {
	return (state.patterns.get(state.selected));
}

/** @param {string} id */
export function toggle(id) {
	state.selected = state.selected === id ? "" : id;
}

/** @param {string} [path] */
export function add_pattern(path) {
	const id = uid();
	const d = path ?? ["M0,0", ...loop(3, 3 / 2, 12), "Z"].join("");
	const count = Math.round(Math.random() * 9 + 3);
	const mirror = Math.random() > 1 / 2;
	const position = { x: Math.random() * 48, y: Math.random() * 48 - 24 };

	state.patterns.set(id, { id, count, mirror, position, d });
	state.selected = id;
}

/** a default map to start from */
export const basic_map = new SvelteMap(
	[
		{
			id: uid(),
			count: 5,
			mirror: true,
			position: { x: 0, y: -80 },
			d: ["M0,0", ...loop(3, 3 / 2, 19), "Z"],
		},
		{
			id: uid(),
			count: 5,
			mirror: false,
			position: { x: 20, y: 0 },
			d: ["M0,0", ...loop(3, 4 / 3, 30), "Z"],
		},
		{
			id: uid(),
			count: 7,
			mirror: true,
			position: { x: 0, y: -50 },
			d: ["M0,0", ...loop(2, 3 / 2, 18), "Z"],
		},
		{
			id: uid(),
			count: 10,
			mirror: false,
			position: { x: 0, y: -150 },
			d: ["M-12,0", ...loop(1, 2, 24), "Z", "M0,-24v12"],
		},
	].map(({ id, count, mirror, position, d }) => [id, { id, count, mirror, position, d: d.join(" ") }]),
);
