import { writable, type Writable } from "svelte/store";
import { v4 } from "uuid";
import { back_and_forth } from "./weaving";
import type { Pattern } from "./data";

export const selected = writable<string | undefined>(undefined);
export const debug = writable<boolean>(false);

const loop = (count: number, bulge: number, length: number) =>
	back_and_forth([
		`a${length / bulge},${length / bulge} 0 0 1 ${length},0`,
		`a${length / bulge},${length / bulge} 0 0 1 -${length},0`,
	])(count);

export const patterns = writable<Map<string, Writable<Pattern>>>(
	new Map(
		[
			{
				id: v4(),
				count: 5,
				mirror: true,
				position: { x: 0, y: -80 },
				d: ["M0,0", ...loop(3, 3 / 2, 19), "Z"].join(" "),
			},
			{
				id: v4(),
				count: 5,
				mirror: false,
				position: { x: 20, y: 0 },
				d: ["M0,0", ...loop(3, 4 / 3, 30), "Z"].join(" "),
			},
			{
				id: v4(),
				count: 7,
				mirror: true,
				position: { x: 0, y: -50 },
				d: ["M0,0", ...loop(2, 3 / 2, 18), "Z"].join(" "),
			},
			{
				id: v4(),
				count: 10,
				mirror: false,
				position: { x: 0, y: -150 },
				d: ["M-12,0", ...loop(1, 2, 24), "Z", "M0,-24v12"].join(" "),
			},
		].map(({ id, count, mirror, position, d }) => [id, writable({ id, count, mirror, position, d })]),
	),
);
