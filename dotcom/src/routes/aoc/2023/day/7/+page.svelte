<script>
	let input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

	const types = /** @type {const} */ ([
		"five of a kind",
		"four of a kind",
		"full house",
		"three of a kind",
		"two pairs",
		"one pair",
		"high card",
	]);

	const first_order = "AKQJT98765432";
	const second_order = "AKQT98765432J";

	/** @typedef {{readonly type: typeof types[number], readonly cards: string}} Hand */

	/** @param {string} order
	 * @returns {(a: Hand, b: Hand) => number}
	 */
	const compare = (order) => (a, b) => {
		const kind = types.indexOf(b.type) - types.indexOf(a.type);
		if (kind !== 0) return kind;

		let diff = 0;
		let counter = 0;
		while (diff === 0) {
			diff = order.indexOf(b.cards[counter] ?? "X") - order.indexOf(a.cards[counter] ?? "X");
			counter++;
		}

		return diff;
	};

	$: hands = input.split("\n").filter(Boolean);

	$: hands_one = hands
		.map((l) => {
			const [cards = "", bid = "-1"] = l.split(" ");

			const map = new Map();
			for (let card of cards) {
				const count = map.get(card) ?? 0;
				map.set(card, count + 1);
			}

			/** @type {Hand["type"]} */
			let type = types[6];

			if (map.size === 1) {
				type = types[0];
			} else if (map.size === 2) {
				type = [...map.values()].some((v) => v === 4) ? types[1] : types[2];
			} else if (map.size === 3) {
				type = [...map.values()].some((v) => v === 3) ? types[3] : types[4];
			} else if (map.size === 4) {
				type = types[5];
			}

			return { cards, bid, type };
		})
		.sort(compare(first_order));

	$: hands_two = hands
		.map((l) => {
			const [cards = "", bid = "-1"] = l.split(" ");

			const map = new Map();
			for (let card of cards) {
				const count = map.get(card) ?? 0;
				map.set(card, count + 1);
			}

			const jokers = map.get("J") ?? 0;

			/** @type {Hand["type"]} */
			let type = types[6];

			if (jokers === 5 || jokers === 4) {
				type = types[0];
			} else if (jokers === 3) {
				type = map.size === 2 ? types[0] : types[1];
			} else if (jokers === 2) {
				switch (map.size - 1) {
					case 1: {
						type = types[0];
						break;
					}
					case 2: {
						type = types[1];
						break;
					}
					case 3: {
						type = types[3];
						break;
					}
					default: {
						console.error("Invalid hand with 2J", cards);
						break;
					}
				}
			} else if (jokers === 1) {
				switch (map.size - 1) {
					case 1: {
						type = types[0];
						break;
					}
					case 2: {
						type = [...map.values()].some((v) => v === 3) ? types[1] : types[2];
						break;
					}
					case 3: {
						type = types[3];
						break;
					}
					case 4: {
						type = types[5];
						break;
					}
					default: {
						console.error("Invalid hand with 1J", cards);
						break;
					}
				}
			} else if (map.size === 1) {
				type = types[0];
			} else if (map.size === 2) {
				type = [...map.values()].some((v) => v === 4) ? types[1] : types[2];
			} else if (map.size === 3) {
				type = [...map.values()].some((v) => v === 3) ? types[3] : types[4];
			} else if (map.size === 4) {
				type = types[5];
			}

			return { cards, bid, type, jokers };
		})
		.sort(compare(second_order));
</script>

<h1>AoC 2023 Day 7</h1>

<textarea rows="12" bind:value={input}></textarea>

<hr />

<h2>Part two: {hands_two.reduce((acc, h, i) => acc + Number(h.bid) * (1 + i), 0)}</h2>

<ol>
	{#each hands_two as hand}
		<li>{hand.cards} has {hand.jokers}J &rarr; {hand.type} w bid {hand.bid}</li>
	{/each}
</ol>

<hr />

<h2>Part one: {hands_one.reduce((acc, h, i) => acc + Number(h.bid) * (1 + i), 0)}</h2>

<ol>
	{#each hands_one as hand}
		<li>{hand.cards} is {hand.type} w bid {hand.bid}</li>
	{/each}
</ol>
