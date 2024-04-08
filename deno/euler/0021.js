// https://projecteuler.net/problem=21

/** @type {
  (number: number)
=>
  Set<number>
} */
const divisors = (number) => {
	const factors = new Set([number]);

	for (let index = 1; index <= Math.sqrt(number); index++) {
		if (number % index !== 0) continue;
		factors.add(index);
		factors.add(number / index);
	}
	factors.delete(number);

	return factors;
};

/** @type {(a: number, b: number) => number}*/
const sum = (a, b) => a + b;

/** @type {
  (number: number)
=>
  number | undefined
} */
const get_amicable = (number) => {
	const potential = [...divisors(number)].reduce(sum, 0);
	// if(potential < number) return undefined; // insight from PDF solution
	return [...divisors(potential)].reduce(sum, 0) === number && potential !== number ? potential : undefined;
};

const answer = (max = 10_000) => {
	const amicables = new Set([220, 284]);
	for (let count = 1; count < max; count++) {
		if (amicables.has(count)) continue;
		const pair = get_amicable(count);
		if (pair === undefined) continue;
		if (pair < count) continue;
		amicables.add(count);
		amicables.add(pair);
	}
	return [...amicables].reduce(sum, 0);
};

if (import.meta.main) {
	console.log(answer());
}

Deno.bench({
	name: "Amicable Numbers (Euler 21)",
	fn: () => {
		answer();
	},
});
