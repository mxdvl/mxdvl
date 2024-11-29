<script>
	let input = ``;


</script>

<textarea rows="7" bind:value={input}></textarea>



<style>
	li {
		padding: 0.25rem;
	}

	span:not(.first, .last) {
		opacity: 0.36;
	}

	.first,
	.last {
		font-weight: bold;
	}
	.first {
		color: var(--blue);
	}

	.last {
		color: var(--red);
	}

	.first.last {
		color: var(--green);
	}
</style>
