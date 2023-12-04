<script>
	let input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

	// 1 – 129326 too high

	const empty = /** @type {readonly number[]} */ ([]);

	$: cards = input.split("\n").flatMap((card) => {
		const [, numbers] = card.split(":");
		if (!numbers) return [];
		const [wins = empty, nums = empty] = numbers
			.split("|")
			.map((ns) => [...ns.matchAll(/\d+/g)].map(({ 0: value }) => value).map(Number));

		return { wins, nums };
	});

	$: wins_per_card = cards.map(({ wins, nums }) => nums.filter((n) => wins.includes(n)));

	$: part_one = wins_per_card.filter(({ length }) => length > 0).map((nums) => 2 ** (nums.length - 1));

	$: part_two = cards.reduce(
		(accumulator, { wins, nums }, index) => {
			const this_card_index = 1 + index;
			const number_of_this_card = accumulator.get(this_card_index);
			if (!number_of_this_card) throw "Invalid number of cards";
			for (const [offset] of nums.filter((n) => wins.includes(n)).entries()) {
				const key = this_card_index + offset + 1;
				const total = (accumulator.get(key) ?? 0) + number_of_this_card;
				accumulator.set(key, total);
			}

			return accumulator;
		},
		/** @type {Map<number, number>} */ (new Map(cards.map((_, index) => [index + 1, 1]))),
	);

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;
</script>

<textarea cols="120" rows="20" bind:value={input}></textarea>

<p>Part two: {[...part_two.values()].reduce(sum)}</p>

<ul>
	{#each part_two as [card_number, count]}
		<li>#{card_number} &times; {count}</li>
	{/each}
</ul>

<p>Part one: {part_one.reduce(sum)}</p>

<ul>
	{#each wins_per_card as win}
		<li>{Math.floor(2 ** (win.length - 1))} &rarr; {win.length === 0 ? "[no match]" : win}</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
