import { derived, get, writable, type Writable } from "svelte/store";
import { loop } from "./weaving";
import type { Pattern } from "./data";
import { patterns_to_string, string_to_patterns } from "./data";

export const selected = writable<string | undefined>(undefined);
export const selected_index = writable<number | undefined>(undefined);
export const toggle = (id: string) => selected.update((s) => (s === id ? undefined : id));
export const debug = writable<boolean>(false);

export const uid = () => Math.random().toString(36).slice(2);

export const patterns = writable<Map<string, Writable<Pattern>>>(new Map());

export const current = derived([patterns, selected], ([$patterns, $selected]) => $patterns.get($selected ?? ""));


const prefix = "#shape/";

/** a default map to start from */
export const basic_map = new Map(
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
	].map(({ id, count, mirror, position, d }) => [id, writable({ id, count, mirror, position, d: d.join(" ") })]),
);

// @TODO: make this a pure function
export const state_to_hash = () => {
	const data = [];

	for (const [, pattern] of get(patterns)) {
		data.push(get(pattern));
	}

	return prefix + patterns_to_string(data);
};

export const hash_to_state = (hash: string) => {
	try {
		if (!hash.startsWith(prefix)) return undefined;

		return string_to_patterns(hash.slice(prefix.length));
	} catch (error) {
		console.error(error);
		return undefined;
	}
};
