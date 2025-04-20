<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import {
		Modal,
		Input,
		Textarea,
		Toggle,
		Button,
		Label,
		Toast
	} from 'flowbite-svelte';

	import Pin from '~icons/mdi/pin';
	import Check from '~icons/material-symbols/check-circle-rounded';

	import { settings } from '$lib/stores/settings.svelte.js';
	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data, form } = $props();

	let loading;
	async function deletePost(hid) {
		loading = true;
	}

	let open = $state(false);
	let editing = $state(false);
	let editObj = $state(null);

	let stags = $state([]);
	let tinput = $state('');
	let released = $state(true);

	let toast = $state(false);
	let msg = $state('');
	let error = $state(null);

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

	let startEdit = (obj) => {
		editing = true;
		editObj = obj;
		stags = obj.full_tags?.map(x => x.name) ?? [];
	}

	let clearTags = () => {
		stags = [];
		tinput = '';
	}

	$effect(() => {
		if(form?.success) {
			open = false;
			editing = false;
			clearTags();
			toast = true;
			msg = form.type;
			setTimeout(() => toast = false, 5_000);
		}
	})
</script>

<Toast bind:toastStatus={toast} color="green" position="top-right" class="top-16 lg:right-66 lg:top-4" >
	<Check slot='icon' />
	Post successfully {msg}!
</Toast>

<h1>Posts</h1>

<Button color="alternative" onclick={() => open = true}>
	+ Add New
</Button>

{#if data?.pinned?.length}
	<div class="pinned">
		<h3><Pin /> Pinned</h3>
		{#each data.pinned as post (post.hid)}
			{@const SvelteComponent = VIEWS.compact}
			<SvelteComponent obj={post} deleteObj={ deletePost } editObj={ startEdit } objType="posts" />
		{/each}
	</div>

	<hr />
{/if}

{#if data?.drafts?.length && view?.value}
	<h3>Drafts</h3>
	<div class={
		'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
	}>
		{#each data.drafts as post (post.hid)}
			{@const SvelteComponent = view.value}
			<SvelteComponent obj={ post } deleteObj={ deletePost } editObj={ startEdit } objType="posts" />
		{/each}
	</div>
{/if}

{#if data?.posts?.length && view?.value}
	<h3>Posts</h3>
	<div class={
		'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
	}>
		{#each data.posts as post (post.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={ post } deleteObj={ deletePost } editObj={ startEdit } objType="posts" />
		{/each}
	</div>
{/if}

<Modal title="Create Post" bind:open size="sm" autoclose={false}>
	<form method="POST" action="/admin/posts?/create" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="title" name="title" placeholder="Title" />
		<Input type="text" id="hid" name="hid" placeholder="Slug" />
		<Input type="text" id="short" name="short" placeholder="Short text" />
		<Input type="text" id="cover_url" name="cover_url" placeholder="Cover image"/>
		<Textarea rows=10 id="body" name="body" placeholder="Body"></Textarea>
		<div class="tags">
			<Input
				type="text"
				id="tags-input"
				bind:value={tinput}
				on:keydown={handleKeys}
				on:keyup={() => released = true}
				placeholder={!stags.length ? "Enter tags..." : ""}
				class="mb-2"
			/>
			{#if stags.length}
				{#each stags as st,_ (_)}
					<input
						type="hidden"
						name="tags"
						value={st}
					/>
					<Button color="alternative" size="xs" on:click={() => remove(_)} on:keypress={() => remove(_)}>
						{st}
					</Button> 
				{/each}
			{/if}
		</div>
		<div class="flex flex-row w-full justify-between">
			<Label for="pinned">Pinned?</Label>
			<Toggle name="pinned"/>
		</div>
		<div class="flex flex-row w-full justify-between">
			<Label for="draft">Save as draft?</Label>
			<Toggle name="draft"/>
		</div>
		<Button type="submit">Submit</Button>
	</form>
</Modal>

<Modal title="Edit Post" bind:open={editing} size="sm" autoclose={false}>
	<form method="POST" action="/admin/posts?/edit" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="title" name="title" placeholder="Title" value={editObj.title} />
		<Input type="text" id="hid" name="hid" placeholder="Slug" value={editObj.hid} />
		<Input type="text" id="short" name="short" placeholder="Short text" value={editObj.short} />
		<Input type="text" id="cover_url" name="cover_url" placeholder="Cover image" value={editObj.cover_url} />
		<Textarea rows=10 id="body" name="body" placeholder="Body" value={editObj.body}></Textarea>
		<div class="tags">
			<Input
				type="text"
				id="tags-input"
				bind:value={tinput}
				on:keydown={handleKeys}
				on:keyup={() => released = true}
				placeholder={!stags.length ? "Enter tags..." : ""}
				class="mb-2"
			/>
			{#if stags.length}
				{#each stags as st,_ (_)}
					<input
						type="hidden"
						name="tags"
						value={st}
					/>
					<Button color="alternative" size="xs" on:click={() => remove(_)} on:keypress={() => remove(_)}>
						{st}
					</Button> 
				{/each}
			{/if}
		</div>
		<div class="flex flex-row w-full justify-between">
			<Label for="pinned">Pinned?</Label>
			<Toggle name="pinned" checked={editObj.pinned} />
		</div>
		<div class="flex flex-row w-full justify-between">
			<Label for="draft">Save as draft?</Label>
			<Toggle name="draft" checked={editObj.draft} />
		</div>
		<Button type="submit">Submit</Button>
	</form>
</Modal>

<style>
.post-item {
	width: 90%;
	max-width: 700px;
	background: rgba(255, 255, 255, .09);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 0 .5rem;
	border-radius: .5rem;
	margin-bottom: .5rem;
}

.pinned {
	width: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

a {
	text-decoration: none;
}

h3 {
	margin: .5rem 0;
}
</style>