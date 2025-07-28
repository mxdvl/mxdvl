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

/**
 * @param {string} str input
 * @returns {bigint} 32-bit unsigned integer
 */
export function murmur3Hash(str) {
	const bytes = new TextEncoder().encode(str);
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
		k = BigInt.asUintN(32, (k << 15n) | (k >> (32n - 15n)))
		k = BigInt.asUintN(32, k * 0x1b873593n);

		hash = BigInt.asUintN(32, hash ^ k);
		// rotate left
		hash = BigInt.asUintN(32, (hash << 13n) | (hash >> (32n - 13n)))
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
