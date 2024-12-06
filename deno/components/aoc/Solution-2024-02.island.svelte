<script>
	let input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

	let part = "two";

	$: reports = input.split("\n").map(report => report.split(" ").map(Number))


	/** @param {number[]} report */
	function isSafeReport(report) {
		const [first, second] = report;
		const direction = second > first ? 'ascending' : 'descending';
		const rest = report.slice();
		while(rest.length >= 2) {
			const [prev,next] = rest;
			if(!isSafe(direction, prev, next)) {
				return false
			}
			rest.shift();
		}
		return true;
	}

	/**
	 * @param {'ascending' | 'descending'} direction
	 * @param {number} prev
	 * @param {number} next
	 */
	function isSafe(direction, prev, next) {
		const diff = next - prev;
		switch (diff) {
			case -1:
			case -2:
			case -3:
				return direction === "descending";
			case 1:
			case 2:
			case 3:
				return direction === "ascending";
			default:
				return false;
		}
	}

	/** @param {number[]} report */
	function is_safe_with_tolerance(report) {
		for(let index = 0; index < report.length; index++) {
			const sub_report = report.toSpliced(index, 1);
			if(isSafeReport(sub_report)) {
				return true;
			}
		}
		return false
	}
</script>

<textarea rows="7" bind:value={input}></textarea>


<details open={part === "one"}>
	<!-- 420 too high -->
	<summary>Part 1 – {reports.filter(isSafeReport).length}</summary>

	<ol>
		{#each reports as report}
			{@const safe = isSafeReport(report)}
			<li class:safe>{report.join(" ")} – {safe ? 'Safe' : 'Unsafe'}</li>
		{/each}
	</ol>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {reports.filter(is_safe_with_tolerance).length}</summary>

	<ol>
		{#each reports as report}
			{@const safe = isSafeReport(report)}
			{@const tolerance = is_safe_with_tolerance(report)}
			<li class:safe class:tolerance>{report.join(" ")} – {safe ? 'Safe' : tolerance ? 'Safe (with tolerance)' : 'Unsafe'}</li>
		{/each}
	</ol>
</details>

<style>
	.tolerance {
		color: var(--red);
		font-weight: bold;
	}

	.safe {
		color: var(--green);
		font-weight: bold;
	}

	ol {
		padding-left: 6ch;
	}
</style>
