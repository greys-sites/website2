<script>
import { add } from '$lib/stores/toasts';
import { enhance } from '$app/forms';
export let form;
export let data;

$: console.log(form, data);
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
      break;
  }
}
</script>

<svelte:head>
  {#if !data.user}<title>Login | Grey Skies</title>{/if}
  {#if data.user}<title>Admin | Grey Skies</title>{/if}
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