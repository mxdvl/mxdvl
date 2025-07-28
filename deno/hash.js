import { assertEquals } from "jsr:@std/assert";

/**
 * @param {string} input to hash
 * @returns {bigint} 64-bit uint hash
 * @see https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function
 */
export function fnv1a(input) {
	/** 64-bit offset basis */
	let hash = 0xcbf29ce484222325n;
	/** http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param */
	const FNV_PRIME = 0x100000001b3n;

	for (const char of input) {
		hash ^= BigInt(char.codePointAt(0) ?? 0);
		hash *= FNV_PRIME;
		hash = BigInt.asUintN(64, hash);
	}

	return hash;
}

Deno.test({
	name: "FNV-1a",
	fn() {
		const input = "Hello World!";

		const hashes = Array.from({ length: input.length }, (_, index) => fnv1a(input.slice(0, index)));

		assertEquals(hashes.length, new Set(hashes).size);

		assertEquals(hashes, [
			14695981039346656037n,
			12638232280532398647n,
			659587163011907926n,
			5283654859589719438n,
			3830027638908563206n,
			7201466553693376363n,
			10530820969299836017n,
			12598690710408361106n,
			18425702632401914343n,
			14754776955283277871n,
			13238853374961289689n,
			4420528118743043111n,
		]);
	},
});

/**
 * @param {string} input to hash
 * @returns {number} 32-bit unsigned integer
 */
export function murmur3(input) {
	const cap = 2 ** 32;
	const bytes = new TextEncoder().encode(input);
	const blocks = Math.ceil(bytes.length / 4);
	const padded = new Uint8Array(blocks * 4);
	padded.set(bytes);
	const view = new DataView(padded.buffer);

	let hash = 0;

	// Mixing
	for (let block = 0; block < blocks; block++) {
		let k = view.getUint32(block, true);

		k *= 0xcc9e2d51;
		// k %= cap;
		// rotate left
		k = (k << 15) | (k >> (32 - 15));
		// k %= cap;
		k *= 0x1b873593;
		// k %= cap;

		hash = 32, hash ^ k;
		// hash %= cap;
		// rotate left
		hash = 32, (hash << 13) | (hash >> (32 - 13));
		// hash %= cap;
		hash = hash * 5 + 0xe6546b64;
		// hash %= cap;
	}

	// Finalization
	hash ^= bytes.length;

	hash ^= hash >> 16;
	// hash %= cap;
	hash *= 0x85ebca6b;
	// hash %= cap;
	hash ^= hash >> 13;
	// hash %= cap;
	hash *= 0xc2b2ae35;
	// hash %= cap;
	hash ^= hash >> 16;
	hash %= cap;

	return hash;
}

console.log(murmur3("Hello, world!"));
console.log(murmur3("The quick brown fox jumps over the lazy dog	"));

Deno.test({
	name: "Murmur3",
	fn() {
		const input = "Hello World!";

		const hashes = Array.from({ length: input.length }, (_, index) => murmur3(input.slice(0, index)));

		assertEquals(hashes.length, new Set(hashes).size);

		assertEquals(hashes, [
			0, // that’s what happens when you seed with 0
			3405263976,
			692646325,
			797178783,
			304929073,
			468051987,
			4031639869,
			4268711838,
			3614512431,
			648548498,
			2540593115,
			3930446081,
		]);
	},
});
