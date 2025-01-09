import { assertEquals } from "jsr:@std/assert";

/**
 * Pseudo-random number generator of numbers in range [0, 1).
 * Not for crypo purposes
 * @param {number} [seed] defaults to Date.now()
 */
export function* PRNG(seed = Date.now()) {
	const ceiling = 2 ** 32;
	for(const int of pcg32(BigInt(seed))) {
		yield Number(int) / ceiling
	}
}


const MULTIPLIER = 6364136223846793005n;
const INCREMENT = 1442695040888963407n;

/**
 * [Permuted Congruential Generator](https://en.wikipedia.org/wiki/Permuted_congruential_generator) for a 32-bit unsigned integer
 * @param {bigint} [seed] defaults to `0x4d595df4d0f33173`.
 */
function* pcg32(seed = 5573589319906701683n) {
	let state = seed + INCREMENT;
	let x = state;
	while (true) {
		state = x * MULTIPLIER + INCREMENT;
		x ^= x >> 18n;
		yield rotate_right(x >> 27n, x >> 59n);
	}
}

/**
 * @param {bigint} x
 * @param {bigint} r
 */
function rotate_right(x, r) {
	return x >> r | x << (-r & 31n);
}

Deno.test({
	name: "pcg",
	fn() {
		const prng = pcg32().take(6);

		assertEquals(Array.from(prng), [
			54814512749133186n,
			54814721573043634n,
			54814512749133186n,
			54814721573043634n,
			54814512749133186n,
			54814721573043634n,
		]);
	},
});

/**
 * [Linear Congruential Generator](https://en.wikipedia.org/wiki/Linear_congruential_generator)
 * @param {Object} options
 * @param {bigint} options.modulus
 * @param {bigint} options.a
 * @param {bigint} options.c
 * @param {bigint} options.seed
 */
function* lcg({ modulus, a, c, seed }) {
	let next = seed;
	while (true) {
		yield next = (a * next + c) % modulus;
	}
}

Deno.test({
	name: "lcg",
	fn() {
		const prng = lcg({ modulus: 120n, a: 9n, c: 3n, seed: 97n }).take(4);

		assertEquals(Array.from(prng), [36n, 87n, 66n, 117n]);
	},
});
