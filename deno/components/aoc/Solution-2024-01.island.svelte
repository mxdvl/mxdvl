<script>
	import { onMount } from "svelte";

	let input = `Nothing to see here yet!`;

	let now = Date.now();

	/** @type {number} */
	let interval;
	onMount(() => {
		interval = setInterval(() => (now = Date.now()), 1000);

		return () => clearInterval(interval);
	});

	/** @param {number} epoch */
	function formattedTime(epoch) {
		const difference = Math.round(
			(new Date("2024-12-01T05:00:00Z").getTime() - epoch) / 1000,
		);
		console.log(difference);
		const seconds = difference % 60;
		const minutes = Math.floor(difference / 60 % 60);
		const hours = Math.floor(difference / 3600);

		return [hours, minutes, seconds].join(":");
	}
</script>

<textarea rows="7" bind:value={input}></textarea>

{formattedTime(now)} before puzzle launch…
