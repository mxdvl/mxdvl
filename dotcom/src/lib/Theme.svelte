<script lang="ts">
	const setTheme = (theme: "light" | "dark" | "default") => {
		document.body.classList.add("themed");
		const { classList } = document.querySelector("html");
		classList.remove("light", "dark", "default");
		switch (theme) {
			case "light":
				classList.add("light");
				localStorage.setItem("theme", "light");
				break;
			case "dark":
				classList.add("dark");
				localStorage.setItem("theme", "dark");
				break;
			case "default":
				classList.add("default");
				localStorage.removeItem("theme");
				break;
		}
		return theme;
	};
</script>

<button on:click={() => setTheme("light")}>light</button>
<button on:click={() => setTheme("dark")}>dark</button>
<button on:click={() => setTheme("default")}>reset</button>

<style>
	button {
		height: var(--grid);
	}
</style>
