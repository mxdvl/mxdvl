import { assertEquals } from "https://deno.land/std@0.193.0/testing/asserts.ts";

function* indices_generator() {
	let count = 1n;
	while (true) {
		yield count;
		yield -count;
		count++;
	}
}

/** @type {
  (coins: bigint)
=>
  bigint
} */
const pentagonal_number = (n) => n * (3n * n - 1n) / 2n;

function* pentagonal_generator() {
	for (const index of indices_generator()) {
		yield pentagonal_number(index);
	}
}

function* partitions_generator() {
	/** @type {bigint[]} */
	const partitions_counts = [1n];
	for (const [index, partitions_count] of partitions_counts.entries()) {
		// console.info({ index, partitions_count });
		yield partitions_count;
		let next = 0n;
		let count = 0n;
		for (const pentagonal of pentagonal_generator()) {
			const value = partitions_counts[index + 1 - Number(pentagonal)] ?? 0n;
			if (value === 0n) break;
			const sign = count++ % 4n < 2n ? 1n : -1n;
			// console.log({ index, did: `${next} ${sign === 1n ? "+" : "-"} ${value} = ${next + value * sign}` });
			next += value * sign;
		}
		partitions_counts.push(next);
	}
}

/** @type {
  (predicate: (ways: bigint) => boolean)
=>
  bigint | undefined
} */
const answer = (predicate) => {
	let n = 0n;
	for (const ways of partitions_generator()) {
		if (predicate(ways)) return n;
		n++;
	}
};

if (import.meta.main) {
	console.log("answer:", answer((ways) => ways % 1_000_000n === 0n));
}

Deno.test({
	name: "indices",
	fn: () => {
		const indices = indices_generator();
		// assertEquals(indices.next().value, 0);
		assertEquals(indices.next().value, 1n);
		assertEquals(indices.next().value, -1n);
		assertEquals(indices.next().value, 2n);
		assertEquals(indices.next().value, -2n);
		assertEquals(indices.next().value, 3n);
		assertEquals(indices.next().value, -3n);
	},
});

Deno.test({
	name: "pentagonal",
	fn: () => {
		const pentagonal = pentagonal_generator();
		// assertEquals(pentagonal.next().value, 0);
		assertEquals(pentagonal.next().value, 1n);
		assertEquals(pentagonal.next().value, 2n);
		assertEquals(pentagonal.next().value, 5n);
		assertEquals(pentagonal.next().value, 7n);
		assertEquals(pentagonal.next().value, 12n);
		assertEquals(pentagonal.next().value, 15n);
		assertEquals(pentagonal.next().value, 22n);
		assertEquals(pentagonal.next().value, 26n);
		assertEquals(pentagonal.next().value, 35n);
		assertEquals(pentagonal.next().value, 40n);
	},
});

Deno.test({
	name: "partitions",
	fn: () => {
		const partitions = partitions_generator();
		assertEquals(partitions.next().value, 1n);
		assertEquals(partitions.next().value, 1n);
		assertEquals(partitions.next().value, 2n);
		assertEquals(partitions.next().value, 3n);
		assertEquals(partitions.next().value, 5n);
		assertEquals(partitions.next().value, 7n);
		assertEquals(partitions.next().value, 11n);
		assertEquals(partitions.next().value, 15n);
	},
});

Deno.test({
	name: "answer",
	fn: () => {
		assertEquals(answer((w) => w === 42n), 10n);
		assertEquals(answer((w) => w === 627n), 20n);
		assertEquals(answer((w) => w === 5_604n), 30n);
		assertEquals(answer((w) => w === 37_338n), 40n);
	},
});
