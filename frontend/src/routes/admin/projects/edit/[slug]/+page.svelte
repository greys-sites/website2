<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form;
	export let data;

	let { proj } = data;
	let oldhid = "" + proj.hid;

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
	        message: `Project edited! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/projects/${form.hid}`), 3000);
	      break;
	  }
	}
</script>

<h1>Edit Project</h1>

<form method="POST" action="?/edit" use:enhance>
	<input type="text" id="name" name="name" placeholder="Name" bind:value={proj.name}/>
	<input type="text" id="hid" name="hid" placeholder="hid" bind:value={proj.hid}/>
	<input type="hidden" id="oldhid" name="oldhid" value={oldhid} />
	<input type="text" id="short" name="short" placeholder="Short text" bind:value={proj.short}/>
	<input type="text" id="cover_url" name="cover_url" placeholder="Cover image" bind:value={proj.cover_url}/>
	<input type="text" id="category" name="category" placeholder="Category" bind:value={proj.category}/>
	<textarea rows=10 id="description" name="description" placeholder="Description" bind:value={proj.description}></textarea>
	<input type="submit" value="Submit">
</form>

<style>
	form {
		flex-direction: column;
	}

	textarea {
		width: 500px;
		background-color: rgba(255, 255, 255, .09);
		color: white;
		border: none;
		border-radius: .5rem;
		padding: 10px;
		margin: 0 0 .5rem 0;
		font-size: 16px;
	}

	input:not([type=checkbox]) {
		width: 500px;
		background-color: rgba(255, 255, 255, .09);
		border: 0px;
		border-radius: 0.5rem;
		padding: 0.5rem;
		color: white;
		margin: 0 0 0.5rem 0;
		font-size: 16px;
	}

	input[type=submit] {
		width: auto;
	}

	@media(max-width: 700px) {
		textarea, input:not([type=checkbox]), .select {
			width: 80%;
		}
	}
</style>