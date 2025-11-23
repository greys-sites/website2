<script>
  import { run } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  /** @type {{form: any, data: any}} */

  let { form, data } = $props();
</script>

<svelte:head>
  {#if data.user}
  	<title>Admin | The Aberration</title>
  {:else}
  	<title>Login | The Aberration</title>
  {/if}
</svelte:head>

{#if data.user}
	<h1>Admin Page</h1>
	<h3>Logged in as {data.user.name}</h3>
{:else}
    <div class="container">
      <form method="POST" action="?/login" use:enhance>
        <input type="text" placeholder="username" name="username" />
        <input type="password" placeholder="password" name="password" />
        <input type="submit" value="submit" />
      </form>
    </div>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  form > input:not([type=checkbox]) {
    margin-bottom: .5rem;
  }
</style>