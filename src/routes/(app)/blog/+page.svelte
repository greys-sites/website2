<script>
	import { stopPropagation } from 'svelte/legacy';

	import { invalidateAll, goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { clickoutside } from '@svelte-put/clickoutside';

	import {
		Button,
		Input,
		Dropdown,
		DropdownItem,
		DropdownHeader
	} from 'flowbite-svelte';

	import Filter from '~icons/material-symbols/filter-list-rounded';
	import Tag from '~icons/majesticons/tag';
	import Pin from '~icons/mdi/pin';

	import { settings } from '$lib/stores/settings.svelte.js';
	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let posts = (
		$state(data.posts
		.sort((a, b) => a.id - b.id)
		.reverse())
	);

	let all = [
		...data.pinned,
		...data.posts
	]

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

	function close() {
		sort_open = false;
		tags_open = false;
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

<svelte:head>
	<title>Blog | The Aberration</title>
</svelte:head>

<h1 class="text-center mb-4">Blog Posts</h1>

<div class="flex flex-row mb-2">
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
				onclick={stopPropagation(() => changeSort(opt.value))}
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
</div>

{#if !searching && data.pinned.length}
	<div class="pinned">
		<h3 class="mb-2"><Pin /> Pinned</h3>
		{#each data.pinned as post (post.hid)}
			{@const SvelteComponent = VIEWS.compact}
			<SvelteComponent obj={post} objType="posts" {changeTags} />
		{/each}
	</div>

	<hr />
{/if}

{#if posts?.length && view?.value}
	<div class={
		'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
	}>
		{#each posts as post (post.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={post} objType="posts" {changeTags} />
		{/each}
	</div>
{:else if searching && all.length > 0}
	<h3>No posts matched your search :(</h3>
{/if}

<style>
	@reference "tailwindcss";

	.pinned {
		@apply mb-2;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	input {
		margin: 0;
	}
</style>