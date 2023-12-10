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
	/** @typedef {Map<typeof first_order[number], number>} Cards */

	/**
	 * @param {string} order
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

	/**
	 * @param {Cards} map
	 * @returns {typeof types[number]}
	 */
	const get_type = (map) => {
		switch (map.size) {
			case 1:
				return types[0];
			case 2:
				return [...map.values()].some((v) => v === 4) ? types[1] : types[2];
			case 3:
				return [...map.values()].some((v) => v === 3) ? types[3] : types[4];
			case 4:
				return types[5];
			case 5:
				return types[6];
		}
		throw "Invalid hand!";
	};

	/**
	 * @param {Cards} map
	 * @returns {typeof types[number]}
	 */
	const get_type_with_jokers = (map) => {
		switch (map.get("J")) {
			case 5:
			case 4:
				return types[0];
			case 3:
				return map.size === 2 ? types[0] : types[1];
			case 2: {
				switch (map.size - 1) {
					case 1:
						return types[0];
					case 2:
						return types[1];
					case 3:
						return types[3];
				}
				return types[6];
			}
			case 1: {
				switch (map.size - 1) {
					case 1:
						return types[0];
					case 2:
						return [...map.values()].some((v) => v === 3) ? types[1] : types[2];
					case 3:
						return types[3];
					case 4:
						return types[5];
				}
				return types[6];
			}
		}
		return types[6];
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

			return { cards, bid: Number(bid), type: get_type(map) };
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

			const type = map.has("J") ? get_type_with_jokers(map) : get_type(map);

			return { cards, bid: Number(bid), type, jokers };
		})
		.sort(compare(second_order));
</script>

<textarea rows="12" bind:value={input}></textarea>

<hr />

<h2>Part two: {hands_two.reduce((acc, h, i) => acc + h.bid * (1 + i), 0)}</h2>

<ol>
	{#each hands_two as hand}
		<li>{hand.cards} has {hand.jokers}J &rarr; {hand.type} w bid {hand.bid}</li>
	{/each}
</ol>

<hr />

<h2>Part one: {hands_one.reduce((acc, h, i) => acc + h.bid * (1 + i), 0)}</h2>

<ol>
	{#each hands_one as hand}
		<li>{hand.cards} is {hand.type} w bid {hand.bid}</li>
	{/each}
</ol>
