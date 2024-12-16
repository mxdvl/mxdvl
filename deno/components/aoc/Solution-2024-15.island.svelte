<script>
	import {
		arrows,
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`);

	let part = $state({ one: true, two: false });

	let steps = $state(0);

	let { wharehouse, moves, width, height } = $derived.by(() => {
		const [top, bottom] = input.split("\n\n");

		let width = 0;
		let height = 0;

		const wharehouse = create_map(top, (character) => {
			switch (character) {
				case "#":
					return "█";
				case "O":
					return "▒";
				case "@":
					return "×";
				default:
					return undefined;
			}
		});

		for (const [coordinates] of wharehouse) {
			const { x, y } = parse_coordinates(coordinates);
			width = Math.max(x, width);
			height = Math.max(y, height);
		}

		const moves = bottom.split("").flatMap((character) => {
			switch (character) {
				case "v":
					return [{ dx: 0, dy: +1 }];
				case ">":
					return [{ dx: +1, dy: 0 }];
				case "^":
					return [{ dx: 0, dy: -1 }];
				case "<":
					return [{ dx: -1, dy: 0 }];
				default:
					return [];
			}
		});

		return { wharehouse, moves, width, height };
	});

	let part_one = $derived.by(() => {
		const moved = new Map(wharehouse);

		let position = { x: -1, y: -1 };
		for (const [coordinates, character] of moved) {
			if (character !== "×") continue;
			position = parse_coordinates(coordinates);
			moved.delete(coordinates);
			break;
		}
		let step = 0;
		while (step < steps && step < moves.length) {
			const { dx, dy } = moves[step];

			// FIXME: ensure we only move if possible,
			// and handle boxes
			position.x += dx;
			position.y += dy;

			step++;
		}

		moved.set(format_coordinates(position), "×");

		return { moved, position };
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one}</summary>

	<input type="number" bind:value={steps} />

	<div class="grid" style="--width:{width};--height:{height};--row:1em;">
		{#each part_one.moved as [coordinates, character]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const red = character === "×"}
			{@const blue = character === "▒"}
			<div class:red class:blue style="grid-area:{y + 1}/{x + 1}">
				{character}
			</div>
		{/each}
	</div>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {part_two}</summary>
</details>

<hr />

<div class="grid">
	<div class="red"></div>
	<div class="green"></div>
	<div class="blue"></div>
</div>

<style>
	.grid {
		display: grid;
		padding: 0;
		list-style-type: none;
		grid-template-columns: repeat(var(--width), var(--col, 1ch));
		grid-template-rows: repeat(var(--height), var(--row, 1.25rem));
	}

	.blue {
		color: var(--blue);
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}
</style>
