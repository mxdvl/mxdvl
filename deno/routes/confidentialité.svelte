<script>
  import { onMount } from "svelte";
  import Button from "../components/Button.svelte";
  import Layout from "../components/Layout.svelte";
  import Alternates from "../components/Alternates.svelte";

  let tracking = false;
  onMount(() => {
    tracking = localStorage.blockFathomTracking ? false : true;
  });

  const block = () => {
    window.fathom?.blockTrackingForMe();
    tracking = false;
  };
  const unblock = () => {
    window.fathom?.enableTrackingForMe();
    tracking = true;
  };
</script>

<Alternates en="/privacy" fr="/confidentialité" />

<Layout>
  <p>
    Un suivi anonyme via <a href="https://usefathom.com/">Fathom</a> me permet de
    savoir quelles pages sont les plus visitées. Vous pouvez toutefois choisir de
    désactiver ce suivi complètement ci-dessous.
  </p>
  <p>
    {#if tracking}
      Suivi anonyme <strong>actif</strong>. <Button on:click={block}
        >Désactiver complètement</Button
      >.
    {:else}
      Aucun suivi. <Button on:click={unblock}>Réactiver</Button>.
    {/if}
  </p>
</Layout>
