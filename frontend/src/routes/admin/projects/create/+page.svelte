<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form;

	let stags = [];

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
	        message: `Project created! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/projects/${form.hid}`), 3000);
	      break;
	  }
	}

	let visible;
	function toggle() {
		visible = !visible;
	}
</script>

<h1>Create Post</h1>

<form method="POST" action="?/create" use:enhance>
	<input type="text" id="name" name="name" placeholder="Name" />
	<input type="text" id="hid" name="hid" placeholder="hid" />
	<input type="text" id="short" name="short" placeholder="Short text" />
	<input type="text" id="cover_url" name="cover_url" placeholder="Cover image"/>
	<input type="text" id="category" name="category" placeholder="Category"/>
	<textarea rows=10 id="description" name="description" placeholder="Description"></textarea>
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
		textarea, input:not([type=checkbox]) {
			width: 80%;
		}
	}
</style>