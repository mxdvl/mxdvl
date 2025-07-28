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
 * @param {number} [seed] optional 32-bit unsigned integer
 * @returns {number} 32-bit unsigned integer
 */
export function murmur3(input, seed = 0) {
	const bytes = new TextEncoder().encode(input);
	const remainder = bytes.length % 4;
	const blocks = (bytes.length - remainder) / 4;
	const { buffer } = new Uint8Array(bytes.length + 4 - remainder);
	const view = new DataView(buffer);

	let hash = seed >>> 0;

	// Mixing
	for (let block = 0; block < blocks; block++) {
		hash ^= mix(view.getUint32(block * 4, true));
		// rotate left
		hash = (hash << 13) | (hash >>> 19);
		hash = Math.imul(hash, 5) + 0xe6546b64;
	}

	if (remainder) {
		// tail logic
		hash ^= mix(view.getUint32(blocks * 4, true));
	}

	// Finalization
	hash ^= bytes.length;
	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;
	hash >>>= 0;

	return hash;
}

/**
 * @param {number} uint8
 * @returns {number} uint8
 */
function mix(uint8) {
	let mixed = uint8;
	mixed = Math.imul(mixed, 0xcc9e2d51);
	mixed = (mixed << 15) | (mixed >>> 17);
	mixed = Math.imul(mixed, 0x1b873593);
	return mixed;
}

Deno.test({
	name: "Murmur3",
	async fn({ step }) {
		await step("(empty)", () => {
			assertEquals(murmur3(""), 0);
		});
		await step("(empty, seeded)", () => {
			assertEquals(murmur3("", 0x00000001), 0x514E28B7);
		});
		await step("test", () => {
			assertEquals(murmur3("test"), 0xba6bd213);
		});
		await step("test (seeded)", () => {
			assertEquals(murmur3("test", 0x9747b28c), 0x704b81dc);
		});
		await step("Hello, world!", () => {
			assertEquals(murmur3("Hello, world!"), 0xc0363e43);
		});
		await step("The quick brown fox jumps over the lazy dog", () => {
			assertEquals(murmur3("The quick brown fox jumps over the lazy dog"), 0x2e4ff723);
		});

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
