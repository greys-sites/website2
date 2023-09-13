<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
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
	        message: `Post edited! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/blog/${form.hid}`), 3000);
	      break;
	  }
	}
</script>

<h1>Create Post</h1>

<form action="?/edit" use:enhance>
	<input type="text" id="title" name="title" placeholder="Title" bind:value={data.title}/>
	<input type="text" id="hid" name="hid" placeholder="Slug" bind:value={data.hid}/>
	<input type="hidden" id="oldhid" name="oldhid" value={data.hid} />
	<input type="text" id="short" name="short" placeholder="Short text" bind:value={data.short}/>
	<textarea rows=10 id="body" name="body" placeholder="Body" bind:value={data.body}></textarea>
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
		border-radius: 10px;
		padding: 10px;
	}

	input {
		width: 500px;
		background-color: rgba(255, 255, 255, .09);
		border: 2px solid #121212;
		border: 0px;
		border-radius: .5rem;
		padding: .5rem;
		color: white;
		margin-right: .5rem;
		font-size: 16px;
	}

	@media(max-width: 700px) {
		textarea {
			width: 80%;
		}

		input {
			width: 80%;
		}
	}
</style>