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
		Toast,
		Dropdown,
		DropdownItem,
		DropdownHeader
	} from 'flowbite-svelte';

	import Filter from '~icons/material-symbols/filter-list-rounded';
	import Tag from '~icons/majesticons/tag';
	import Pin from '~icons/mdi/pin';
	import Check from '~icons/material-symbols/check-circle-rounded';
	import Plus from '~icons/material-symbols/add-box-rounded';

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
		if(!form) return;

		if(form.success) {
			open = false;
			editing = false;
			clearTags();
			toast = true;
			msg = form.type;
			setTimeout(() => toast = false, 5_000);
		}

		posts = (
			data.posts
			.sort((a, b) => a.id - b.id)
			.reverse()
		)
	})

	let posts = (
		$state(data.posts
		.sort((a, b) => a.id - b.id)
		.reverse())
	);

	let all = $derived([
		...data.pinned,
		...data.posts
	])

	let sorts = [
		{
			name: 'newest to oldest',
			value: 'asc'
		},
		{
			name: 'oldest to newest',
			value: 'desc'
		}
	]

	let filters = $state({
		sort: sorts[0].value,
		tags: [],
		search: ''
	})

	let tagsButton = $state();
	let tags_open = $state(false);
	function toggleTags() {
		tags_open = !tags_open;
	}

	let changeTags = (tag) => {
		if(filters.tags.includes(tag)) {
			filters.tags = filters.tags.filter(x => x != tag)
		} else filters.tags = [...filters.tags, tag];
		set();
	}

	let sortButton = $state();
	let sort_open = $state(false);
	function toggleSort() {
		sort_open = !sort_open;
	}

	function changeSort(opt) {
		filters.sort = opt;
		set();
	}

	let timeout;
	function set() {
		if(timeout) clearTimeout(timeout);
		timeout = setTimeout(()=> search(), 250)
	}

	let searching = $state(false);
	function search() {
		if(
			filters.tags.length ||
			filters.search.length
		) searching = true;
		else searching = false;

		posts = all.filter(p => {
			let s, t;
			if(!filters.search?.length) s = true;
			else if(p.title.toLowerCase().includes(filters.search)) s = true;
			else s = false;

			if(!filters.tags?.length) t = true;
			else {
				let ftags = filters.tags.filter(x => {
					return p.full_tags.find(xt => xt.name == x)
				})
				if(ftags.length == filters.tags.length) t = true;
				else t = false;
			}

			return (s && t);
		})

		console.log("filtered", posts);

		if(!searching) posts = data.posts;
		posts = posts.sort((a, b) => a.id - b.id);
		if((filters.sort ?? 'asc') == 'asc') return posts.reverse();
		else return posts;
	}
</script>

<Toast bind:toastStatus={toast} color="green" position="top-right" class="top-16 lg:right-66 lg:top-4" >
	<Check slot='icon' />
	Post successfully {msg}!
</Toast>

<h1>Posts</h1>

<div class="flex flex-row my-2">
	<Button
		onclick={() => { tags_open = true }}
		color={filters.tags?.length ? "blue" : "alternative"}
		size="xs"
	>
		<Tag />
	</Button>
	<Dropdown bind:open={tags_open}>
		<DropdownHeader>
			<h3>Filter Tags</h3>
		</DropdownHeader>
		{#each data.tags as tag (tag.hid)}
			<DropdownItem
				class={ filters.tags.includes(tag.name) ? 'selected' : '' }
				onclick={() => changeTags(tag.name)}
			>
				{tag.name}
			</DropdownItem>
		{/each}
	</Dropdown>

	<Button
		onclick={() => { sort_open = true }}
		color="alternative" size="xs" class="mx-1"
	>
		{#if filters.sort == "desc"}
			<Filter class="rotate-180" />
		{:else}
			<Filter />
		{/if}
	</Button>
	<Dropdown bind:open={sort_open}>
		<DropdownHeader>
			<h3>Sort Posts</h3>
		</DropdownHeader>
		{#each sorts as opt,_ (_)}
			<DropdownItem
				class={ filters.sort == opt.value ? 'selected' : '' }
				onclick={() => changeSort(opt.value)}
			>
				{opt.name}
			</DropdownItem>
		{/each}
	</Dropdown>

	<Input
		type="text"
		bind:value={filters.search}
		oninput={() => set()}
		placeholder="Enter a search query..."
	/>

	<Button
		color="alternative"
		size="xs"
		class="mx-1"
		onclick={() => open = true}
	>
		<Plus />
	</Button>
</div>

{#if !searching && data?.pinned?.length}
	<div class="pinned">
		<h3><Pin /> Pinned</h3>
		{#each data.pinned as post (post.hid)}
			{@const SvelteComponent = VIEWS.compact}
			<SvelteComponent obj={post} deleteObj={ deletePost } editObj={ startEdit } {changeTags} objType="posts" />
		{/each}
	</div>

	<hr />
{/if}

{#if !searching && data?.drafts?.length && view?.value}
	<h3>Drafts</h3>
	<div class={
		'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
	}>
		{#each data.drafts as post (post.hid)}
			{@const SvelteComponent = view.value}
			<SvelteComponent obj={ post } deleteObj={ deletePost } editObj={ startEdit } {changeTags} objType="posts" />
		{/each}
	</div>
{/if}

{#if posts?.length && view?.value}
	<h3>Posts</h3>
	<div class={
		'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
	}>
		{#each posts as post (post.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={ post } deleteObj={ deletePost } editObj={ startEdit } {changeTags} objType="posts" />
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