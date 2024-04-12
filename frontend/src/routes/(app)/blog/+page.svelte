<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { clickoutside } from '@svelte-put/clickoutside'
	import { add as addToast } from '$lib/stores/toasts';

	import Card from '$lib/components/posts/card.svelte';
	import Compact from '$lib/components/posts/compact.svelte';

	import FAsc from '$lib/components/icons/filter_asc.svelte';
	import FDesc from '$lib/components/icons/filter_desc.svelte';
	import Tag from '$lib/components/icons/tag.svelte';
	import Pin from '$lib/components/icons/pin.svelte';

	export let data;

	let views = {
		'card': Card,
		'compact': Compact
	}

	$: selected = (
		views[data?.settings?.view_type] ??
		views['card']
	);

	let posts = (
		data.posts
		.sort((a, b) => a.id - b.id)
		.reverse()
	);

	let all = [
		...data.pinned,
		...data.posts
	]

	let sorts = [
		{
			name: 'newest to oldest',
			value: 'desc'
		},
		{
			name: 'oldest to newest',
			value: 'asc'
		}
	]

	let filters = {
		sort: sorts[0].value,
		tags: [],
		search: ''
	}

	let tagsButton;
	let tags_open = false;
	function toggleTags() {
		tags_open = !tags_open;
	}

	function changeTags(tag) {
		if(filters.tags.includes(tag)) {
			filters.tags = filters.tags.filter(x => x != tag)
		} else filters.tags = [...filters.tags, tag];
		set();
	}

	let sortButton;
	let sort_open = false;
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

	let searching = false;
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

		posts = posts.sort((a, b) => a.id - b.id);
		if(!searching) posts = data.posts;
		if((filters.sort ?? 'desc') == 'desc') return posts.reverse();
		else return posts;
	}
</script>

<h1>Blog Posts</h1>

<div class="filters">
	<div class="filters-inner">
		<button
			use:clickoutside
			on:clickoutside={() => tags_open = false}
			on:click={() => {toggleTags()}}
			bind:this={tagsButton}
		>
			<Tag />
		</button>
		<button
			use:clickoutside
			on:clickoutside={() => sort_open = false}
			on:click={() => {toggleSort()}}
			bind:this={sortButton}
		>
			{#if filters.sort == "asc"}
				<FAsc />
			{:else}
				<FDesc />
			{/if}
		</button>
		<input
			type="text"
			bind:value={filters.search}
			on:input={() => set()}
			placeholder="Enter a search query..."
		/>
	</div>
	{#if tags_open}
		<div
			transition:fly|global={{ y: 10, duration: 250 }}
			style={
				`top: ${tagsButton?.offsetTop + tagsButton?.offsetHeight}px; ` +
				`left: ${tagsButton?.offsetLeft}px;`
			}
			class="select tags-menu"
		>
			<h3>Filter Tags</h3>
			<div class="select-inner">
				{#each data.tags as tag (tag.hid)}
					<div
						class="select-option"
						class:selected={ filters.tags.includes(tag.name) }
						on:click|stopPropagation={() => changeTags(tag.name)}
					>
						{tag.name}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if sort_open}
		<div
			transition:fly|global={{ y: 10, duration: 250 }}
			style={
				`top: ${sortButton?.offsetTop + sortButton?.offsetHeight}px; ` +
				`left: ${sortButton?.offsetLeft}px;`
			}
			class="select"
		>
			<h3>Sort Posts</h3>
			{#each sorts as opt,_ (_)}
				<div
					class="select-option"
					class:selected={ filters.sort == opt.value }
					on:click|stopPropagation={() => changeSort(opt.value)}
				>
					{opt.name}
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if !searching && data.pinned.length}
	<div class="pinned">
		<h3><Pin /> Pinned</h3>
		{#each data.pinned as post (post.hid)}
			<Compact obj={post} objType="posts" />
		{/each}
	</div>

	<hr />
{/if}

{#if posts?.length > 0}
	{#each posts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={post} objType="posts" />
	{/each}
{:else if all.length > 0}
	<h3>No posts matched your search :(</h3>
{:else}
	<h3>No posts to see :)</h3>
{/if}

<style>
.pinned {
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