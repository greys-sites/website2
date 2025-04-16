<script>
  import { run } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  /** @type {{form: any, data: any}} */

  let { form, data } = $props();
</script>

<svelte:head>
  {#if data.user}
  	<title>Admin | Grey Skies</title>
  {:else}
  	<title>Login | Grey Skies</title>
  {/if}
</svelte:head>

{#if !data.user}
<div class="container">
<form method="POST" action="?/login" use:enhance>
	<input type="text" placeholder="username" name="username" />
	<input type="password" placeholder="password" name="password" />
	<input type="submit" value="submit" />
</form>
</div>
{/if}

{#if data.user}
	<h1>Admin Page</h1>
	<h3>Logged in as {data.user.name}</h3>
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