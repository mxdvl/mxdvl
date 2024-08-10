<script>
	let input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

	const digit = /(\d|one|two|three|four|five|six|seven|eight|nine)/;

	/** @type {Record<string | number, number>}*/
	const mappings = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
	};

	$: lines = input.split("\n").filter(Boolean);

	/**
	 * @param {'forwards' | 'backwards'} direction
	 * @param {string} line
	 * @returns {{value: number, position: readonly [number, number]} | undefined}
	 */
	const get_digit = (direction, line) => {
		let subline = "";
		while (subline.length <= line.length) {
			const match = subline.match(digit);
			if (match && typeof match.index === "number") {
				const index = direction === "forwards" ? match.index : line.length - subline.length;
				return {
					value: mappings[match[0]] ?? 0,
					position: [index, index + match[0].length],
				};
			}
			subline = direction === "forwards" ? line.slice(0, subline.length + 1) : line.slice(-(subline.length + 1));
		}
		return;
	};

	$: numbers = lines.flatMap((line) => {
		const first = get_digit("forwards", line);
		const last = get_digit("backwards", line);
		if (!first || !last) return [];
		return {
			number: Number([first.value, last.value].join("")),
			line,
			first,
			last,
		};
	});
</script>

<textarea rows="7" bind:value={input}></textarea>

<pre>{numbers.map(({ number }) => number).reduce((a, b) => a + b)}</pre>

<ul>
	{#each numbers as { number, first, last, line }}
		<li>
			{number} –
			{#each line.split("") as letter, index}
				<span
					data-index={index}
					class:first={first.position[0] <= index && index < first.position[1]}
					class:last={last.position[0] <= index && index < last.position[1]}
					>{letter}
				</span>
			{/each}
		</li>
	{/each}
</ul>

<style>
	li {
		padding: 0.25rem;
	}

	span:not(.first, .last) {
		opacity: 0.36;
	}

	.first,
	.last {
		font-weight: bold;
	}
	.first {
		color: var(--blue);
	}

	.last {
		color: var(--red);
	}

	.first.last {
		color: var(--green);
	}
</style>
