<script>
	let input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

	const firstDigit = /^.*?(one|two|three|four|five|six|seven|eight|nine|\d)/;
	const lastDigit = /.+(one|two|three|four|five|six|seven|eight|nine|\d).*?$/;

	/** @type {Record<string, number>}*/
	const mappings = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
	};

	$: lines = input.split("\n").filter(Boolean);

	$: numbers = lines
		.map((line) => {
			const [, first] = line.match(firstDigit) ?? [];
			const [, last] = line.match(lastDigit) ?? [];
			if (!first || !last) return "";
			return [mappings[first] ?? first, mappings[last] ?? last].join("");
		})
		.map(Number);
</script>

<textarea rows="7" bind:value={input}></textarea>

<ul>
	{#each numbers as number, index (index)}
		<li>{number} : {lines[index]}</li>
	{/each}
</ul>

<pre>{numbers.reduce((a, b) => a + b)}</pre>
