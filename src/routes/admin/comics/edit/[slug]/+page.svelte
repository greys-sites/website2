<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import Plus from '$lib/components/icons/plus.svelte';
	import Minus from '$lib/components/icons/minus.svelte';

	export let form;
	export let data;

	let { com } = data;
	let oldhid = "" + com.hid;

	let imgCount = com.images?.length || 1;

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
	        message: `Comic edited! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/comics/${form.hid}`), 3000);
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

<h1>Edit Comic</h1>

<form method="POST" action="?/edit" use:enhance>
	<input type="text" id="name" name="name" placeholder="Name" bind:value={com.name}/>
	<input type="text" id="hid" name="hid" placeholder="hid" bind:value={com.hid}/>
	<input type="hidden" id="oldhid" name="oldhid" value={oldhid} />
	<input type="text" id="tagline" name="tagline" placeholder="tagline text" bind:value={com.tagline}/>
	<input type="text" id="thumbnail" name="thumbnail" placeholder="Cover image" bind:value={com.thumbnail}/>
	<input type="text" id="story" name="story" placeholder="story" bind:value={com.story}/>
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
				<input type="text" name="img-name" placeholder="image name" value={com.images?.[i]?.name ?? ""}/>
				<input type="text" name="img-url" placeholder="image url" value={com.images?.[i]?.url ?? ""} />
			</div>
		{/each}
	</div>
	<textarea rows=10 id="description" name="description" placeholder="Description" bind:value={com.description}></textarea>
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

	@media(max-width: 700px) {
		textarea, input:not([type=checkbox]) {
			width: 80%;
		}
	}
</style>