<script lang="ts">
	const now: Omit<Date, `set${string}`> = new Date()
	let hours = $state(now.getHours())
	let minutes = $state(now.getMinutes())
</script>

<svg viewBox="-60 -60 120 120" width="240" height="240">
	<circle cx="0" cy="0" r="50" fill="none" stroke="black" />
	<path d="" />
</svg>
