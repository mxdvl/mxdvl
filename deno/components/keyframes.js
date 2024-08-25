/**
 * @param {object} options
 * @param {number} options.length number of slides
 * @param {number} options.display duration of display
 * @param {number} options.fade duration of fade
 * @param {boolean} options.last whether the slide is last
 */
export const keyframes = ({ length, last, fade, display }) => {
	const frames = /** @type {const} @satisfies {ReadonlyArray<{time: number, opacity: 0 | 1}>} */ ([
		{ time: 0, opacity: 0 },
		{ time: fade, opacity: 1 },
		{ time: fade + display + fade * (last ? 0 : 1), opacity: 1 },
		{ time: fade + display + fade * (last ? 1 : 1.01), opacity: 0 },
	]);
	const duration = length * (fade + display);
	return frames.map(({ time, opacity }) => `${(time / duration) * 100}% { opacity: ${opacity}; }`).join("\n");
};
