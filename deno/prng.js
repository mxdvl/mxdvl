import { assertLess, assertEquals, assertGreaterOrEqual } from "jsr:@std/assert";

/**
 * Pseudo-random number generator of numbers in range [0, 1).
 * Not for crypo purposes
 * @param {bigint} [seed] defaults to Date.now()
 */
export function* PRNG(seed = BigInt(Date.now())) {
	const ceiling = 2 ** 32;
	for (const int of pcg32(seed)) {
		yield Number(int) / ceiling;
	}
}

Deno.test({
	name: "PNRG [0, 1)",
	fn() {
		assertEquals(Array.from(PRNG(42n).take(12)), [
			0.7615582845173776,
			0.41808728338219225,
			0.4481155041139573,
			0.2661335177253932,
			0.9597071812022477,
			0.4091600296087563,
			0.7960081798955798,
			0.8356900119688362,
			0.48016405291855335,
			0.996387166203931,
			0.7091387419495732,
			0.40304759168066084,
		]);

		for (const seed of [42n, 120n, 987654321n, 0n]) {
			for (const value of PRNG(seed).take(2 ** 18)) {
				assertGreaterOrEqual(value, 0)
				assertLess(value, 1)
			}
		}
	},
});

const MULTIPLIER = 6364136223846793005n;
const INCREMENT = 1442695040888963407n;

/**
 * [Permuted Congruential Generator](https://en.wikipedia.org/wiki/Permuted_congruential_generator) for a 32-bit unsigned integer
 * @param {bigint} [seed] defaults to `0x4d595df4d0f33173`.
 */
function* pcg32(seed = 5573589319906701683n) {
	let state = seed + INCREMENT;
	while (true) {
		state = BigInt.asUintN(64, state * MULTIPLIER + INCREMENT);
		/** XOR-shifted */
		const xsh = BigInt.asUintN(32, ((state >> 18n) ^ state) >> 27n);
		const rotation = BigInt.asUintN(32, state >> 59n);
		yield BigInt.asUintN(32, xsh >> rotation | xsh << (-rotation & 31n));
	}
}

Deno.test({
	name: "PCG32",
	fn() {
		const prng = pcg32().take(6);

		assertEquals(Array.from(prng), [
			1150555626n,
			1699080561n,
			1140875202n,
			3036938165n,
			1448871516n,
			4110472253n,
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
	name: "LCG",
	fn() {
		const prng = lcg({ modulus: 120n, a: 9n, c: 3n, seed: 97n }).take(4);

		assertEquals(Array.from(prng), [36n, 87n, 66n, 117n]);
	},
});
