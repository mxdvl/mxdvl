// https://projecteuler.net/problem=2

function* fibonnaci_generator() {
	let previous = 0n;
	let current = 1n;
	while (true) {
		yield current;
		const next = current + previous;
		previous = current;
		current = next;
	}
}

const answer = (max = 4_000_000n) => {
	let sum = 0n;
	for (const number of fibonnaci_generator()) {
		if (number % 2n !== 0n) continue;
		if (number > max) return sum;
		sum += number;
	}
};

if (import.meta.main) {
	console.log(answer());
}

Deno.bench({
	name: "Even Fibonacci Numbers (Euler 2)",
	fn: () => {
		answer();
	},
});
