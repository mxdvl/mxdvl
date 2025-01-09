import { assertEquals, assertGreaterOrEqual, assertLess } from "jsr:@std/assert";

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
			0.13170378981158137,
			0.755355317145586,
			0.5831400000024587,
			0.21037689154036343,
			0.9376081398222595,
			0.6338424978312105,
			0.7061422956176102,
			0.06342564942315221,
			0.2751847072504461,
			0.004724327474832535,
			0.18847966892644763,
			0.5039901344571263,
		]);

		for (const seed of [42n, 120n, 987654321n, 0n]) {
			for (const value of PRNG(seed).take(2 ** 18)) {
				assertGreaterOrEqual(value, 0);
				assertLess(value, 1);
			}
		}
	},
});

/**
 * [Permuted Congruential Generator](https://en.wikipedia.org/wiki/Permuted_congruential_generator) for a 32-bit unsigned integer
 * @param {bigint} seed defaults to `42n`.
 * @param {bigint} sequence defaults to `0n`.
 */
function* pcg32(seed = 42n, sequence = 0n) {
	const multiplier = 6364136223846793005n;
	/** an even number, always */
	const increment = BigInt.asUintN(64, (sequence << 1n) | 1n);
	// let state = BigInt.asUintN(64, (seed + increment) * multiplier + increment);
	let state = BigInt.asUintN(64, (increment + seed) * multiplier + increment);
	while (true) {
		/** XOR-shifted */
		const xsh = BigInt.asUintN(32, ((state >> 18n) ^ state) >> 27n);
		const rotation = BigInt.asUintN(32, state >> 59n);
		yield BigInt.asUintN(32, xsh >> rotation | xsh << (-rotation & 31n));
		state = BigInt.asUintN(64, state * multiplier + increment);
	}
}

//
console.log([...pcg32(42n, 54n).take(5)]);

Deno.test({
	name: "PCG32",
	fn() {
		const prng = pcg32().take(6);

		assertEquals(Array.from(prng), [
			565663470n,
			3244226384n,
			2504567229n,
			903561869n,
			4026996297n,
			2722332799n,
		]);

		assertEquals(Array.from(pcg32(42n, 54n).take(5)), [
			2707161783n,
			2068313097n,
			3122475824n,
			2211639955n,
			3215226955n,
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
