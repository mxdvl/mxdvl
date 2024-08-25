<script>
	let input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

	$: lines = input
		.split(",")
		.map((l) => l.trim())
		.filter(Boolean);

	/**
	 * @param {string} sequence
	 */
	const get_value = (sequence) => {
		let value = 0;
		for (const character of sequence) {
			value += character.charCodeAt(0);
			// console.log({ character, ascii: character.charCodeAt(0) });
			value *= 17;
			value %= 256;
		}
		return value;
	};
	// too high 519083
</script>

<textarea cols="60" rows="6" bind:value={input}></textarea>

<hr />

<h2>Part 1</h2>

<p>
	Total weight on north beam: <strong>{lines.reduce((acc, line) => acc + get_value(line), 0)}</strong>
</p>

<ul>
	{#each lines as line}
		<li>{line} &rarr; {get_value(line)}</li>
	{/each}
</ul>

<style>
</style>
