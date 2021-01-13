<script>
  import Counter from "$components/Counter.svelte";
  import Header from "$components/Header.svelte";
  import Footer from "$components/Header.svelte";
</script>

<Header />

<Footer />

<style>
  :root {
    font-family: "IBM Plex Variable", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
      "Helvetica Neue", sans-serif;

    --accent: hsl-str(hsl(24, 96%, 60%));

    --lightest: hsl-str(hsl(240, 12%, 100%));
    --light: hsl-str(hsl(204, 18%, 72%));

    --dark: hsl-str(hsl(240, 12%, 18%)); /*rgb(60, 72, 84)*/
    --darkest: hsl-str(hsl(204, 24%, 18%));
  }

  :root.dark {
    --darkest: hsl-str(hsl(204, 24%, 6%));
    --dark: hsl-str(hsl(204, 24%, 18%));

    --lightest: hsl-str(hsl(240, 24%, 96%));
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;

    background-color: var(--dark);
    color: var(--lightest);
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 4rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 2rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
