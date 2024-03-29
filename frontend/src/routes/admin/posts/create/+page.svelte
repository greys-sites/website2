<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form;

	let stags = [];

	let tinput = '';
	let released = true;

	function remove(ind) {
		stags = stags.filter((x, i) => i !== ind);
	}

	function handleKeys(e) {
		switch(e.key) {
			case "Enter":
			case ",":
				e.preventDefault();
				if(tinput?.length) {
					stags = [...stags, tinput];
					tinput = '';
				}
				break;
			case "Backspace":
				if(!tinput?.length && stags.length && released) {
					e.preventDefault();
					tinput = stags[stags.length - 1];
					stags = stags.slice(0, stags.length - 1);
					released = false;
				} else if(tinput.length) released = false;
				break;
		}
	}

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
	        message: `Post created! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/blog/${form.hid}`), 3000);
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
	<input type="text" id="title" name="title" placeholder="Title" />
	<input type="text" id="hid" name="hid" placeholder="Slug" />
	<input type="text" id="short" name="short" placeholder="Short text" />
	<input type="text" id="cover_url" name="cover_url" placeholder="Cover image" />
	<textarea rows=10 id="body" name="body" placeholder="Body"></textarea>
	<div class="tags">
		{#if stags.length}
			{#each stags as st,_ (_)}
				<input
					type="hidden"
					name="tags"
					value={st}
				/>
				<span class="tag-item" on:click={() => remove(_)} on:keypress={() => remove(_)}>
					{st}
				</span> 
			{/each}
		{/if}
		<input
			type="text"
			id="tags-input"
			bind:value={tinput}
			on:keydown={handleKeys}
			on:keyup={() => released = true}
		/>
	</div>
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

	form > input {
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

	.tags {
		width: 90%;
		background-color: rgba(255, 255, 255, .09);
		border: 0px;
		border-radius: 0.5rem;
		color: white;
		font-size: 16px;
		margin: 0 0 0.5rem 0;
		padding: .5rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		max-width: 500px;
	}

	.tags .tag-item {
		width: fit-content;
		background-color: rgba(255, 255, 255, .09);
		padding: .5rem;
		border-radius: 5px;
		margin: 5px 5px 5px 0;
		cursor: pointer;
	}

	#tags-input {
		margin: 0;
		padding: .5rem;
		background-color: transparent;
		color: white;
		border: none;
		flex-grow: 1;
		width: 50px;
	}

	@media(max-width: 700px) {
		textarea, input, .tags {
			width: 80%;
		}
	}
</style>