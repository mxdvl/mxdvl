<script>
	import NetworkGraph from "./NetworkGraph.svelte";

	let input = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

	/** @param {string} list */
	const generate_directions = function* (list) {
		let counter = 0;
		while (counter < list.length) {
			const next = list[counter];
			if (next === "L" || next === "R") yield next;
			else return;
			counter = (counter + 1) % list.length;
		}
	};

	$: list = input.trimStart().match(/^[RL]+/)?.[0] ?? "";

	$: nodes = input
		.split("\n")
		.flatMap((line) => {
			const matches = line.match(/^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/);
			if (!matches) return [];
			const [, location = "………", L = "...", R = "..."] = matches;
			return { location, L, R };
		})
		.reduce((map, { location, L, R }) => {
			map.set(location, { L, R });
			return map;
		}, /** @type {Map<string, { L: string, R: string }>} */ (new Map()));

	/**
	 * @param {Map<string, { L: string, R: string }>} nodes
	 * @param {string} list
	 */
	const get_steps = (nodes, list) => {
		const steps = ["AAA"];
		let step = steps.at(-1) ?? "AAA";
		const directions = generate_directions(list);
		while (step !== "ZZZ" && step !== "---") {
			const next_direction = directions.next().value;
			if (!next_direction) break;
			const next_node = nodes.get(step)?.[next_direction] ?? "---";
			steps.push(next_node);
			step = next_node;
			// console.log(steps);
		}
		return steps;
	};

	// not 999, higher

	$: steps = get_steps(nodes, list);

	/**
	 * @param {string} starting
	 * @param {Map<string, { L: string, R: string }>} nodes
	 * @param {string} list
	 */
	const get_steps_two = (starting, nodes, list) => {
		const steps = [starting];
		let step = starting;
		const directions = generate_directions(list);
		while (!step.endsWith("Z") && step !== "---") {
			const next_direction = directions.next().value;
			if (!next_direction) break;
			const next_node = nodes.get(step)?.[next_direction] ?? "---";
			steps.push(next_node);
			step = next_node;
			// console.log(steps);
		}
		return steps;
	};

	// https://stackoverflow.com/a/61352020
	/** @type {(a: number, b: number) => number}*/
	const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
	/** @type {(a: number, b: number) => number}*/
	const lcm = (a, b) => (a / gcd(a, b)) * b;
	/** @type {(ns: number[]) => number}*/
	const lcmAll = (ns) => ns.reduce(lcm, 1);

	$: part_two_steps = [...nodes.keys()]
		.filter((location) => location.endsWith("A"))
		.map((starting) => get_steps_two(starting, nodes, list));

	const width = 600;
	const height = 600;

	$: graph = part_two_steps.reduce(
		(acc, steps, group) => {
			const unique_steps = new Set(steps);
			let step_index = 0;
			for (const step of unique_steps) {
				const node = nodes.get(step);

				if (!node) continue;

				/** @param {{group: number}} d */
				const center = ({ group }) => ({
					x: (group % 3) * ((2.5 * width) / part_two_steps.length) - width / 2,
					y: Math.floor(group / 3) * ((4 * height) / part_two_steps.length) - height / 2,
				});

				const radius = 120;
				const { x, y } = center({ group });

				const dx = radius * Math.sin((Math.PI * 2 * step_index) / unique_steps.size);
				const dy = radius * Math.cos((Math.PI * 2 * step_index) / unique_steps.size);
				acc.nodes.push({ id: step, group, x: x + dx, y: y + dy });
				acc.links.push({ source: step, target: node.L }, { source: step, target: node.R });

				step_index++;
			}

			return acc;
		},
		{
			nodes: /** @type {import('./types.js').NodeDatum[]} */ ([]),
			links: /** @type {import('./types.js').LinkDatum[]}*/ ([]),
		},
	);
</script>

<textarea rows="12" bind:value={input}></textarea>

<hr />

<h2>Part two: {lcmAll(part_two_steps.map((steps) => steps.length - 1))} steps</h2>

<!-- <div>{JSON.stringify(force_graph)}</div> -->

<!-- <ol>
	{#each [...nodes.entries()].filter( ([location]) => ["NCN", "CVS", "MVD", "DBM"].includes(location), ) as [location, { L, R }]}
		<li>{L} &larr; {location} &rarr; {R}</li>
	{/each}
</ol> -->

<ol>
	{#each part_two_steps as steps}
		<li>{steps[0]} &rarr; {steps.length - 1} steps to a ..Z</li>
	{/each}
</ol>

{#key input}
	<NetworkGraph {graph} width={900} height={600} />
{/key}

<ol>
	{#each [...nodes.entries()].filter(([location]) => location.endsWith("Z")) as [location, { L, R }]}
		<li>{L} &larr; {location} &rarr; {R}</li>
	{/each}
</ol>

<hr />

<h2>Part one: {steps.length - 1} steps</h2>

<ul>
	{#each nodes.entries() as [location, { L, R }]}
		<!-- <li>{L} &larr; {location} &rarr; {R}</li> -->
		<!-- <li>"{location}",</li> -->
		<li>{L} &larr; {location} &rarr; {R}</li>
	{/each}
</ul>
