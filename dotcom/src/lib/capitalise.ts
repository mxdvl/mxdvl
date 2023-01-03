export const capitalise = <T extends string>(s: T): Capitalize<T> =>
	(s.slice(0, 1).toUpperCase() + s.slice(1)) as Capitalize<T>;
