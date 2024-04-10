<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import Plus from '$lib/components/icons/plus.svelte';
	import Minus from '$lib/components/icons/minus.svelte';
	
	export let form;

	let imgCount = 1;

	$: canSub = imgCount > 1;

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
	        message: `Flag created! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/flags/${form.hid}`), 3000);
	      break;
	  }
	}

	function addImg() {
		imgCount += 1;
	}

	function subImg() {
		imgCount -= 1;
		if(imgCount < 1) imgCount = 1;
	}
</script>

<h1>Create Flag</h1>

<form method="POST" action="?/create" use:enhance>
	<input type="text" id="name" name="name" placeholder="Name" />
	<input type="text" id="hid" name="hid" placeholder="hid" />
	<input type="text" id="thumbnail" name="thumbnail" placeholder="Thumbnail url"/>
	<input type="text" id="category" name="category" placeholder="Category"/>
	<div class="img-setup">
		<div class="img-buttons">
			<button type="button" on:click={addImg} on:keypress={addImg}>
				<Plus />
			</button>
			<button type="button" on:click={subImg} on:keypress={subImg}>
				<Minus />
			</button>
		</div>
		{#each { length: imgCount } as _, i (i)}
			<div class="img-inputs">
				<input type="text" name="img-name" placeholder="image name" />
				<input type="text" name="img-url" placeholder="image url" />
			</div>
		{/each}
	</div>
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
		font-size: 1rem;
	}

	input:not([type=checkbox]) {
		width: 500px;
		background-color: rgba(255, 255, 255, .09);
		border: 0px;
		border-radius: 0.5rem;
		padding: 0.5rem;
		color: white;
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
	}

	input[type=submit] {
		width: auto;
	}

	.img-inputs {
		margin: 10px 0;
		display: flex;
		flex-direction: row;
	}

	.img-inputs input {
		width: 50%;
		margin: 0 5px;
	}

	.img-buttons {
		text-align: center;
	}

	.img-buttons > button {
		margin: 0 5px;
	}

	@media(max-width: 700px) {
		textarea, input:not([type=checkbox]) {
			width: 80%;
		}
	}
</style>