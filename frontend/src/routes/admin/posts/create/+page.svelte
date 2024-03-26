<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form;
	export let data;

	let stags = [];

	let tinput = '';

	function remove(ind) {
		stags = stags.filter((x, i) => i !== ind);
	}

	function handleKeys(e) {
		console.log(e.key);
		switch(e.key) {
			case "Enter":
			case ",":
				if(tinput?.length) {
					stags.push(tinput);
					tinput = '';
				}
				console.log('stags', stags);
				break;
			case "Backspace":
				if(!tinput?.length) {
					tinput = stags.pop();
				}
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
		{#each stags as st,_ (_)}
			<input
				type="text"
				name="tags"
				id="tags-{_}"
				value={st}
				disabled
				on:click={() => remove(_)}
			/>
		{/each}
		<input
			type="text"
			id="tags-input"
			bind:value={tinput}
			on:keydown|preventDefault={handleKeys}
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

	input[type=checkbox] {
		appearance: none;
		font: inherit;
		color: currentColor;
		width: 1.15em;
		height: 1.15em;
		border: 0.15em solid currentColor;
		border-radius: 0.15em;
		display: grid;
		place-content: center;
	}

	input[type=checkbox]::before {
		content: "";
		width: 0.65em;
		height: 0.65em;
		transform: scale(0);
		opacity: 0;
		transition: 120ms ease-in-out;
		box-shadow: inset 1em 1em #9966cc;
	}

	input[type=checkbox]:checked::before {
		transform: scale(1);
		opacity: 1;
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
	}

	.tags input {
		margin: 0;
		padding: 0;
	}

	@media(max-width: 700px) {
		textarea, input:not([type=checkbox]), .select {
			width: 80%;
		}
	}
</style>