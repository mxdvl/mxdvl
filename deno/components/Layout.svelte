<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Analytics from "./Analytics.island.svelte";
  import { capitalise } from "../../dotcom/src/lib/capitalise.js";

  export let url = new URL("https://www.mxdvl.com/");

  /** @type {import('./lang.js').Lang} */
  export let lang = "en";
</script>

<svelte:head>
  <title
    >MXDVL – {url.pathname
      .split("/")
      .filter(({ length }) => length > 0)
      .slice(0, 1) // TODO: handle deeper navigations
      .map(decodeURIComponent)
      .map(capitalise)}</title
  >
  <style>
    :root {
      --ocean: rgb(0% 63.29% 66.65%);
      --glint: rgb(100% 46.32% 10.17%);

      --earth: rgb(0% 14.37% 13.78%);
      --clouds: rgb(93.44% 98.82% 100%);
      --skies: rgb(78.7% 91.16% 93.87%);

      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --earth: rgb(93.44% 98.82% 100%);
        --clouds: rgb(0% 19.5% 22.66%);
        --skies: rgb(0% 11.53% 13.59%);
      }
    }

    @supports (color: lch(66% 120 54)) {
      :root {
        --ocean: lch(60% 72 204);
        --glint: lch(66% 120 54);

        --earth: lch(12% 60 192);
        --clouds: lch(98% 6 216);
        --skies: lch(90% 12 216);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --earth: lch(98% 6 216);
          --clouds: lch(18% 24 216);
          --skies: lch(9% 24 216);
        }
      }
    }

    html {
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    @font-face {
      font-family: "IBM Plex Sans Variable";
      font-style: normal;
      font-weight: 100 700;
      src:
        local("IBM Plex Sans Var"),
        local("IBMPlexSansVar-Roman"),
        url("/assets/IBMPlexSansVar-Roman.woff2") format("woff2-variations");
      font-display: optional;
    }

    @font-face {
      font-family: "IBM Plex Mono";
      font-style: normal;
      font-weight: 400;
      src:
        local("IBM Plex Mono"),
        local("IBMPlexMono"),
        url("/assets/IBMPlexMono-Text-Latin1.woff2") format("woff2");
      font-display: optional;
    }

    body {
      font-family: "IBM Plex Sans Variable", system-ui, sans-serif;

      font-weight: 400;

      /*
	Weight axis: 100 – 700
	Width axis: 85 – 100
	*/

      /* font-variation-settings: "wght" var(--weight), "wdth" var(--weight); */

      font-size: 16px;
      background-color: var(--clouds);
      transition: background-color 1.2s;
      margin: 0;
    }

    body.themed {
      transition: background-color 1.2s;
    }

    @media (prefers-reduced-motion: reduce) {
      body {
        transition: none;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0 0 var(--grid) 0;
      line-height: calc(2 * var(--grid));
    }

    h1 {
      font-size: 2rem;
    }

    a {
      --border: var(--ocean);
      color: inherit;
      text-decoration-style: solid;
      text-decoration-color: var(--border);
      text-decoration-line: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }

    a:hover {
      color: var(--border);
    }

    a:active {
      color: var(--glint);
    }

    p {
      margin: 0;
      padding: var(--grid) 0;
    }

    picture {
      display: block;
      position: relative;
      --ratio: 9;
      width: calc(var(--width) * var(--grid));
      height: calc(var(--width) * var(--ratio) * var(--grid));
      color: var(--skies);
      background-image: linear-gradient(
          to bottom right,
          transparent calc(50% - 1px),
          currentColor calc(50% - 1px),
          currentColor calc(50% + 1px),
          transparent calc(50% + 1px)
        ),
        linear-gradient(
          to top right,
          transparent calc(50% - 1px),
          currentColor calc(50% - 1px),
          currentColor calc(50% + 1px),
          transparent calc(50% + 1px)
        );
      background-position: calc(0.5 * var(--grid-x)) var(--grid-y);
      background-size: var(--grid-x) var(--grid-y);

      transition: color 1.2s;
    }

    /* -- GRID --------------------------- */

    #grid {
      --grid: 1.125rem;
      --grid-double: calc(2 * var(--grid));
      --grid-x: calc(2 * var(--grid));
      --grid-y: calc(1 * var(--grid));

      width: calc(var(--columns) * var(--grid));
      margin: 0 auto;
      padding-block: calc(0.25 * var(--grid-y));
      padding-inline: calc(0.25 * var(--grid-x));
      line-height: var(--grid);
      color: var(--earth);

      position: relative;

      transition: color 1.2s;
    }

    #grid::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      color: var(--skies);

      background-image: radial-gradient(
          circle at 25% 75%,
          currentColor 1px,
          transparent 1px
        ),
        radial-gradient(circle at 75% 25%, currentColor 1px, transparent 1px);
      background-position: top left;
      background-size: var(--grid-x) var(--grid-y);
    }

    .themed #grid,
    .themed #grid::before {
      transition: color 1.2s;
    }

    /*
See $lib/grid.ts for generating these widths
deno run dotcom/src/lib/grid.ts | pbcopy
*/

    @media screen and (min-width: 342px) {
      #grid {
        --columns: 18;
      }
    }

    @media screen and (min-width: 450px) {
      #grid {
        --columns: 24;
      }
    }

    @media screen and (min-width: 558px) {
      #grid {
        --columns: 30;
      }
    }

    @media screen and (min-width: 666px) {
      #grid {
        --columns: 36;
      }
    }

    @media screen and (min-width: 774px) {
      #grid {
        --columns: 42;
      }
    }

    @media screen and (min-width: 882px) {
      #grid {
        --columns: 48;
      }
    }

    @media screen and (min-width: 990px) {
      #grid {
        --columns: 54;
      }
    }

    @media screen and (min-width: 1098px) {
      #grid {
        --columns: 60;
      }
    }

    @media screen and (min-width: 1206px) {
      #grid {
        --columns: 66;
      }
    }

    @media screen and (min-width: 1314px) {
      #grid {
        --columns: 72;
      }
    }
  </style>

  <script>
    const html = document.querySelector("html");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      const { theme } = localStorage;
      if (theme) {
        html.classList.add(theme);
        document
          .querySelector("link[rel=icon]")
          ?.setAttribute("href", `/cmps-${theme}.svg`);
        document
          .querySelector("link[rel=apple-touch-icon]")
          ?.setAttribute("href", `/cmps-icon-${theme}.png`);
        document
          .querySelector("link[rel=mask-icon]")
          ?.setAttribute(
            "color",
            theme === "dark"
              ? "rgb(93.44% 98.82% 100%)"
              : "rgb(0% 14.37% 13.78%)",
          );
      } else {
        html.classList.toggle("dark", mq.matches);
        html.classList.toggle("light", !mq.matches);
        document
          .querySelector("link[rel=mask-icon]")
          ?.setAttribute(
            "color",
            mq.matches ? "rgb(93.44% 98.82% 100%)" : "rgb(0% 14.37% 13.78%)",
          );
      }
    } catch (error) {
      console.error(error);
    }
  </script>
</svelte:head>

<div id="grid">
  <Header {url} {lang} />

  <main>
    <slot />
  </main>

  <Footer {url} {lang} />
</div>

<Analytics />

<style>
  main {
    padding: var(--grid-double) 0;
    margin: 0 auto;
  }
</style>
