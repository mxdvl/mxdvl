import { assertEquals } from "jsr:@std/assert";

const encoder = new TextEncoder();

/**
 * @param {string} input UTF-8 string to hash
 * @returns {bigint} 64-bit unsigned integer
 * @see https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function
 */
export function fnv1a64(input) {
	/** 64-bit offset basis */
	let hash = 0xcbf29ce484222325n;
	/** http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param */
	const FNV_PRIME = 0x100000001b3n;

	for (const char of encoder.encode(input)) {
		hash ^= BigInt(char);
		hash *= FNV_PRIME;
		hash = BigInt.asUintN(64, hash);
	}

	return hash;
}

Deno.test({
	name: "FNV-1a (64-bit)",
	async fn({ step }) {
		await step("foobar", () => {
			assertEquals(fnv1a64("foobar"), 0x85944171f73967e8n);
		});

		await step("Hello World!", () => {
			assertEquals(fnv1a64("Hello World!"), 0x8c0ec8d1fb9e6e32n);
		});

		await step("Uniqueness & spread", () => {
			const hashes = [
				"Hello",
				"HELLO",
				"hello",
				"hell",
				"HellO",
				"ello",
				"h_llo",
				"world",
				"worlds",
				"WORLD",
				"!",
				"🌏",
			].map((input) => murmur3(input));

			assertEquals(hashes.length, new Set(hashes).size);
		});
	},
});

/**
 * @param {string} input to hash
 * @param {number} [seed] optional 32-bit unsigned integer
 * @returns {number} 32-bit unsigned integer
 */
export function murmur3(input, seed = 0) {
	const bytes = encoder.encode(input);
	const remainder = bytes.length % 4;
	const blocks = (bytes.length - remainder) / 4;
	const padded = new Uint8Array(4 * (blocks + 1));
	padded.set(bytes);
	const view = new DataView(padded.buffer);

	let hash = seed >>> 0;

	// Mixing
	for (let block = 0; block < blocks; block++) {
		hash ^= mix(view.getUint32(block * 4, true));
		// Rotate left
		hash = (hash << 13) | (hash >>> 19);
		hash = Math.imul(hash, 5) + 0xe6546b64;
	}

	// Tail
	if (remainder) {
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
 * @param {number} input 32-bit unsigned integer
 * @returns {number} 32-bit unsigned integer
 */
function mix(input) {
	let mixed = input;
	mixed = Math.imul(mixed, 0xcc9e2d51);
	// Rotate left
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
			assertEquals(murmur3("", 0x00000001), 0x514e28b7);
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

		await step("Uniqueness & spread", () => {
			const hashes = [
				"Hello",
				"HELLO",
				"hello",
				"hell",
				"HellO",
				"ello",
				"h_llo",
				"world",
				"worlds",
				"WORLD",
				"!",
				"🌏",
			].map((input) => murmur3(input));

			assertEquals(hashes.length, new Set(hashes).size);
		});
	},
});

/**
 * @param {string} input UTF-8 string to hash
 * @returns {Promise<bigint>} 256-bit unsigned integer
 * @see https://en.wikipedia.org/wiki/SHA-2
 */
export async function sha256(input) {
	const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
	return new Uint8Array(buffer)
		.reduce((accumulator, next) => accumulator << 8n | BigInt(next), 0n);
}

Deno.test({
	name: "SHA-256",
	async fn({ step }) {
		await step("(empty)", async () => {
			assertEquals(await sha256(""), 0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855n);
		});

		await step("Hello World!", async () => {
			assertEquals(
				await sha256("Hello World!"),
				0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069n,
			);
		});

		await step("Uniqueness & spread", async () => {
			const hashes = await Promise.all([
				"Hello",
				"HELLO",
				"hello",
				"hell",
				"HellO",
				"ello",
				"h_llo",
				"world",
				"worlds",
				"WORLD",
				"!",
				"🌏",
			].map((input) => sha256(input)));

			assertEquals(hashes.length, new Set(hashes).size);
		});
	},
});
