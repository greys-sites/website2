<script>
  import {
    Button,
  } from 'flowbite-svelte';

  import Arrow from '~icons/mdi/arrow-left';

  let { text, back } = $props();

</script>

<nav class="
  hidden w-full sticky top-12 lg:top-0 p-2 bg-white dark:bg-gray-900
  z-10 md:flex flex-row justify-start items-center mb-2
  border border-gray-300 dark:border-gray-700
">
  <Button pill color="alternative" on:click={back} class="border-none rounded-full p-2 mr-2">
      <span class="sr-only">Go back</span>
      <Arrow class="p-0 m-0 w-6 h-6" />
    </Button>

  <h1 class="text-lg">{text}</h1>
</nav>