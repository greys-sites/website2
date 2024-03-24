<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form;
	export let data;

	let { flag } = data;
	let oldhid = "" + flag.hid;

	let imgCount = flag.images?.length || 1;

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
	        message: `Flag edited! Redirecting...`,
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

<h1>Edit flagic</h1>

<form method="POST" action="?/edit" use:enhance>
	<input type="text" id="name" name="name" placeholder="name" bind:value={flag.name}/>
	<input type="text" id="hid" name="hid" placeholder="hid" bind:value={flag.hid}/>
	<input type="hidden" id="oldhid" name="oldhid" value={oldhid} />
	<input type="text" id="thumbnail" name="thumbnail" placeholder="cover image" bind:value={flag.thumbnail}/>
	<input type="text" id="category" name="category" placeholder="category" bind:value={flag.category}/>
	<div class="img-setup">
		<div class="img-btns">
			<btn on:click={addImg}>Add image</btn>
			<btn on:click={subImg}>Remove image</btn>
		</div>
		{#each { length: imgCount } as _, i (i)}
			<div class="img-inputs">
				<input type="text" name="img-name" placeholder="image name" value={flag.images?.[i]?.name ?? ""}/>
				<input type="text" name="img-url" placeholder="image url" value={flag.images?.[i]?.url ?? ""} />
			</div>
		{/each}
	</div>
	<textarea rows=10 id="description" name="description" placeholder="Description" bind:value={flag.description}></textarea>
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
		textarea, input:not([type=checkbox]), .select {
			width: 80%;
		}
	}
</style>