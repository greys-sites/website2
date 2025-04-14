<script>
	import { add } from '$lib/stores/toasts';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import Toggle from '$lib/components/toggle.svelte';

	export let form;
	export let data;

	let { post, tags } = data;
	let oldhid = "" + post.hid;

	let stags = post.full_tags?.map(x => x.name) ?? [];

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
	        message: `Post edited! Redirecting...`,
	        timeout: 3000,
	        canClose: true
	      })

	      setTimeout(() => goto(`/blog/${form.hid}`), 3000);
	      break;
	  }
	}

</script>

<h1>Edit Post</h1>

<form method="POST" action="?/edit" use:enhance>
	<input type="text" id="title" name="title" placeholder="Title" bind:value={post.title}/>
	<input type="text" id="hid" name="hid" placeholder="Slug" bind:value={post.hid}/>
	<input type="hidden" id="oldhid" name="oldhid" value={oldhid} />
	<input type="text" id="short" name="short" placeholder="Short text" bind:value={post.short}/>
	<input type="text" id="cover_url" name="cover_url" placeholder="Cover image" bind:value={post.cover_url}/>
	<textarea rows=10 id="body" name="body" placeholder="Body" bind:value={post.body}></textarea>
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
			placeholder={!stags.length ? "Enter tags..." : ""}
		/>
	</div>
	<Toggle value={post.pinned} name="pinned" label="Pinned?" />
	<Toggle value={post.draft} name="draft" label="Save as draft?"/>
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

	form > input {
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

	.tags {
		width: 90%;
		background-color: rgba(255, 255, 255, .09);
		border: 0px;
		border-radius: 0.5rem;
		color: white;
		margin: 0 0 0.5rem 0;
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
		margin: .5rem 0 .5rem .5rem;
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
		font-size: 1rem;
	}

	@media(max-width: 700px) {
		textarea, input, .tags {
			width: 80%;
		}
	}
</style>