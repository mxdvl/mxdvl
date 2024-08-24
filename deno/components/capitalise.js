/** @type {<T extends string>(s: T) => Capitalize<T>} */
export const capitalise = (s) =>
	// @ts-expect-error -- we’re confident that it matches!
	s.slice(0, 1).toUpperCase() + s.slice(1);
