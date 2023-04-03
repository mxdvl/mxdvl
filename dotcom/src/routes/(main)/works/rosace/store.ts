import { derived, writable, type Writable } from "svelte/store";
import { loop } from "./weaving";
import type { Pattern } from "./data";

export const selected = writable<string | undefined>(undefined);
export const selected_index = writable<number | undefined>(undefined);
export const toggle = (id: string) => selected.update((s) => (s === id ? undefined : id));
export const debug = writable<boolean>(false);

export const uid = () => Math.random().toString(36).slice(2);

export const patterns = writable<Map<string, Writable<Pattern>>>(
	new Map(
		[
			{
				id: uid(),
				count: 5,
				mirror: true,
				position: { x: 0, y: -80 },
				d: ["M0,0", ...loop(3, 3 / 2, 19), "Z"].join(" "),
			},
			{
				id: uid(),
				count: 5,
				mirror: false,
				position: { x: 20, y: 0 },
				d: ["M0,0", ...loop(3, 4 / 3, 30), "Z"].join(" "),
			},
			{
				id: uid(),
				count: 7,
				mirror: true,
				position: { x: 0, y: -50 },
				d: ["M0,0", ...loop(2, 3 / 2, 18), "Z"].join(" "),
			},
			{
				id: uid(),
				count: 10,
				mirror: false,
				position: { x: 0, y: -150 },
				d: ["M-12,0", ...loop(1, 2, 24), "Z", "M0,-24v12"].join(" "),
			},
		].map(({ id, count, mirror, position, d }) => [id, writable({ id, count, mirror, position, d })]),
	),
);

export const current = derived([patterns, selected], ([$patterns, $selected]) => $patterns.get($selected ?? ""));
