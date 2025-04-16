<script>
  import {
    Button,
  } from 'flowbite-svelte';

  import Arrow from '~icons/mdi/arrow-left';

  let { text, back } = $props();

</script>

<div class="
  hidden w-full p-0 lg:p-2 sticky lg:fixed mx-auto max-w-[700px]
  z-10 md:flex flex-row justify-start items-center
  bg-white dark:bg-gray-900 lg:left-64
">
  <Button pill color="alternative" on:click={back} class="border-none rounded-full p-2 mr-2">
      <span class="sr-only">Go back</span>
      <Arrow class="p-0 m-0 w-6 h-6" />
    </Button>

  <h3>{text}</h3>
</div>

<style>
  @reference "tailwindcss";

  h3 {
    @apply mt-0;
  }
</style>