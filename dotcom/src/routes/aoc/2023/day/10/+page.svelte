<script>
	let input = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`;

	/** @typedef {`${number},${number}`} Coordinates */
	/** @typedef {typeof mappings[keyof typeof mappings]} Pipe */

	const mappings = /** @type {const} */ ({
		S: "╬",
		F: "╔",
		L: "╚",
		"7": "╗",
		J: "╝",
		"-": "═",
		"|": "║",
	});

	const directions = /** @type {const} */ ({
		up: { x: 0, y: -1 },
		right: { x: 1, y: 0 },
		down: { x: 0, y: 1 },
		left: { x: -1, y: 0 },
	});

	$: lines = input.split("\n").filter((line) => line.match(/^[S.|\-JF7L]+$/));

	$: cols = lines[0]?.length ?? 1;
	$: rows = lines.length;

	$: spaces = lines.flatMap((line, y) => line.split("").map((letter, x) => ({ letter, x, y })));

	/** @type {Coordinates} */
	let start;

	/** @type {(letter: string) => letter is keyof typeof mappings}*/
	const is_valid = (letter) => letter in mappings;

	/**
	 * @param {Object} coordinates
	 * @param {number} coordinates.x
	 * @param {number} coordinates.y
	 * @returns {Coordinates}
	 */
	const format = ({ x, y }) => `${x},${y}`;
	/**
	 * @param {Coordinates} coordinates
	 * @returns {{x: number, y: number }}
	 */
	const parse = (coordinates) => {
		const [x = -1, y = -1] = coordinates.split(",").map(Number);
		return { x, y };
	};

	$: pipes = new Map(
		spaces
			.filter(({ letter }) => letter !== ".")
			.map((pipe) => {
				const coord = format(pipe);
				if (pipe.letter === "S") start = coord;
				if (!is_valid(pipe.letter)) throw "Invalid letter";
				return /** @type {const} */ ([coord, mappings[pipe.letter]]);
			}),
	);

	$: empties = new Set(spaces.filter(({ letter }) => letter === ".").map(format));

	/**
	 * @param {keyof typeof directions} direction
	 * @param {Pipe} next
	 */
	const connects = (direction, next) => {
		switch (direction) {
			case "right":
				return "═╝╗".includes(next);
			case "up":
				return "║╔╗".includes(next);
			case "down":
				return "║╚╝".includes(next);
			case "left":
				return "═╚╔".includes(next);
		}
	};

	/**
	 * @param {Coordinates} coord
	 * @returns {Coordinates[]}
	 */
	const adjacent = (coord) => {
		const { x, y } = parse(coord);
		return [
			{ x: x + 1, y },
			{ x: x - 1, y },
			{ x, y: y + 1 },
			{ x, y: y - 1 },
		].map(format);
	};

	/**
	 * @param {Coordinates} coord
	 * @param {keyof typeof directions} direction
	 */
	const move = (coord, direction) => {
		const { x, y } = parse(coord);
		const { x: dx, y: dy } = directions[direction];
		return format({ x: x + dx, y: y + dy });
	};

	/**
	 * @param {Pipe} pipe
	 * @param {keyof typeof directions} direction
	 */
	const redirect = (pipe, direction) => {
		switch (pipe) {
			case "╔":
				return direction === "up" ? "right" : "down";
			case "╚":
				return direction === "down" ? "right" : "up";
			case "╗":
				return direction === "right" ? "down" : "left";
			case "╝":
				return direction === "right" ? "up" : "left";
			case "═":
				return direction === "right" ? "right" : "left";
			case "║":
				return direction === "up" ? "up" : "down";
			case "╬":
				return undefined; // we finished the loop
		}
	};

	/**
	 *
	 * @param {Map<Coordinates, typeof mappings[keyof typeof mappings]>} pipes
	 * @param {Coordinates} start
	 */
	const get_loop = (pipes, start) => {
		/** @type {Map<Coordinates, number>}*/
		const loop = new Map();
		/** @type {Set<Coordinates>}*/
		const inside = new Set();
		const outside = new Set();

		console.log({ start });
		loop.set(start, 0);

		let search = /** @type {const} */ (["up", "right", "down", "left"])
			.flatMap((direction) => {
				const coord = move(start, direction);
				const pipe = pipes.get(coord);
				if (!pipe) return [];

				console.log();

				return { direction, pipe, coord: start };
			})
			.find(({ direction, pipe }) => connects(direction, pipe));

		let index = 0;
		while (search) {
			const { direction, pipe, coord } = search;
			loop.set(coord, ++index);

			const next_coord = move(coord, direction);
			const next_pipe = pipes.get(next_coord);
			console.log({ coord, pipe, next_coord, next_pipe });
			if (!next_pipe) break;
			const next_direction = redirect(next_pipe, direction);
			if (!next_direction) break;

			switch (next_pipe) {
				case "╔": {
					if (direction === "left") {
						inside.add(move(next_coord, "left"));
						inside.add(move(next_coord, "up"));
					} else if (direction == "up") {
						outside.add(move(next_coord, "left"));
						outside.add(move(next_coord, "up"));
					} else {
						// throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "╚": {
					if (direction === "down") {
						inside.add(move(next_coord, "left"));
						inside.add(move(next_coord, "down"));
					} else if (direction === "left") {
						outside.add(move(next_coord, "left"));
						outside.add(move(next_coord, "down"));
					} else {
						throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "╗": {
					if (direction === "up") {
						inside.add(move(next_coord, "right"));
						inside.add(move(next_coord, "up"));
					} else if (direction === "right") {
						outside.add(move(next_coord, "right"));
						outside.add(move(next_coord, "up"));
					} else {
						throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "╝": {
					if (direction === "right") {
						inside.add(move(next_coord, "down"));
						inside.add(move(next_coord, "right"));
					} else if (direction === "down") {
						outside.add(move(next_coord, "down"));
						outside.add(move(next_coord, "right"));
					} else {
						throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "═": {
					if (direction === "right") {
						inside.add(move(next_coord, "down"));
						outside.add(move(next_coord, "up"));
					} else if (direction === "left") {
						inside.add(move(next_coord, "up"));
						outside.add(move(next_coord, "down"));
					} else {
						throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "║": {
					if (direction === "up") {
						inside.add(move(next_coord, "right"));
						outside.add(move(next_coord, "left"));
					} else if (direction === "down") {
						inside.add(move(next_coord, "left"));
						outside.add(move(next_coord, "right"));
					} else {
						throw `Invalid! ${next_pipe} ${direction}`;
					}
					break;
				}
				case "╬": {
					// we finished the loop
					break;
				}
			}

			search = {
				coord: next_coord,
				pipe: next_pipe,
				direction: next_direction,
			};
		}

		for (const coord of inside) {
			if (loop.has(coord)) continue;

			const adjacents = adjacent(coord).filter((coord) => {
				if (loop.has(coord)) return false;
				if (inside.has(coord)) return false;
				const { x, y } = parse(coord);
				return 0 <= x && x <= cols && 0 <= y && y <= rows;
			});
			console.log({ adjacents });
			for (const close of adjacents) {
				inside.add(close);
			}
		}

		return { loop, inside, outside };
	};

	$: ({ loop, inside, outside } = get_loop(pipes, start));

	$: console.log({ pipes, inside });
</script>

<textarea cols="24" rows="12" bind:value={input}></textarea>

<hr />

<h2>Part 2</h2>

<p>There are {[...inside].filter((coord) => !loop.has(coord)).length} elements inside the loop</p>

<hr />

<h2>Part 1</h2>

<p>Starting at {start}, the furthest step is {Math.floor(loop.size / 2)}</p>

<ul class="graph" style="grid-template-columns: repeat({cols}, 1ch);">
	{#each pipes as [coord, letter]}
		{@const { x, y } = parse(coord)}
		<li
			class:start={letter === "╬"}
			class:loop={loop.has(coord)}
			class:inside={inside.has(coord)}
			style="grid-column-start:{x + 1};grid-row-start:{y + 1};--delay:{(loop.get(coord) ?? 0) * 3}ms;"
		>
			{letter}
		</li>
	{/each}
	{#each empties as coord}
		{@const { x, y } = parse(coord)}
		{#if inside.has(coord)}
			<li class="inside" style="grid-column-start:{x + 1};grid-row-start:{y + 1};">╬</li>
		{/if}
	{/each}
</ul>

<hr />

<style>
	.graph {
		display: grid;
		list-style-type: none;
		grid-template-columns: repeat(var(--cols), min-content);
		line-height: 1.25;
		font-family: ui-monospace, monospace;
	}

	.inside {
		color: var(--green);
	}

	.loop {
		color: var(--blue);
		animation: scale-in 12ms both;
		animation-delay: var(--delay);
	}

	.start {
		color: var(--red);
	}

	li:not(.inside, .outside, .loop) {
		opacity: 0.12;
	}

	@keyframes scale-in {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}
</style>
