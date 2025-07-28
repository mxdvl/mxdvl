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
 * @returns {bigint} 32-bit unsigned integer
 */
export function murmur3(input) {
	const bytes = new TextEncoder().encode(input);
	const blocks = Math.ceil(bytes.length / 4);
	const padded = new Uint8Array(blocks * 4);
	padded.set(bytes);
	const view = new DataView(padded.buffer);

	let hash = 0n;

	// Mixing
	for (let block = 0; block < blocks; block++) {
		let k = BigInt(view.getUint32(block, true));

		k = BigInt.asUintN(32, k * 0xcc9e2d51n);
		// rotate left
		k = BigInt.asUintN(32, (k << 15n) | (k >> (32n - 15n)));
		k = BigInt.asUintN(32, k * 0x1b873593n);

		hash = BigInt.asUintN(32, hash ^ k);
		// rotate left
		hash = BigInt.asUintN(32, (hash << 13n) | (hash >> (32n - 13n)));
		hash = BigInt.asUintN(32, hash * 5n + 0xe6546b64n);
	}

	// Finalization
	hash ^= BigInt(bytes.length);

	hash ^= hash >> 16n;
	hash = BigInt.asUintN(32, hash * 0x85ebca6bn);
	hash ^= hash >> 13n;
	hash = BigInt.asUintN(32, hash * 0xc2b2ae35n);
	hash ^= hash >> 16n;

	return BigInt.asUintN(32, hash);
}

Deno.test({
	name: "Murmur3",
	fn() {
		const input = "Hello World!";

		const hashes = Array.from({ length: input.length }, (_, index) => murmur3(input.slice(0, index)));

		assertEquals(hashes.length, new Set(hashes).size);

		assertEquals(hashes, [
			0n, // that’s what happens when you seed with 0
			3405263976n,
			692646325n,
			797178783n,
			304929073n,
			468051987n,
			4031639869n,
			4268711838n,
			3614512431n,
			648548498n,
			2540593115n,
			3930446081n,
		]);
	},
});
