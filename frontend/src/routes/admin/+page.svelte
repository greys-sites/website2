<script>
import { add } from '$lib/stores/toasts';
import { addModal, closeAll } from '$lib/stores/modals';
import { enhance } from '$app/forms';
export let form;
export let data;

$: if(form) {
  switch(form.success) {
    case false:
      add({
        type: 'error',
        message: `${form.status}: ${form.message}`,
        timeout: 5000,
        canClose: true
      })
      break;
    default:
      add({
        type: 'success',
        message: `Login successful!`,
        timeout: 5000,
        canClose: true
      })
      break;
  }
}

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
	<button on:click={() => {
		add({
			message: "yeet",
			type: "info",
			canClose: true,
			timeout: 1000
		})
	}}>test</button>
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