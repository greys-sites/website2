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

	export let data;

	let views = {
		'card': Card,
		'compact': Compact
	}

	$: selected = (
		views[data?.settings?.view_type] ??
		views['card']
	);

	let posts = data.posts.sort((a, b) => a.id - b.id).reverse();

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

	function handleEnter(e) {
		if(e.key == 'Enter') search();
	}

	let timeout;
	function set() {
		if(timeout) clearTimeout(timeout);
		timeout = setTimeout(()=> search(), 250)
	}

	function search() {
		console.log(filters)
		posts = data.posts.filter(p => {
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
		console.log("sorted", posts);
		if((filters.sort ?? 'desc') == 'desc') return posts.reverse();
		else return posts;
	}
</script>

<h1>Blog Posts</h1>

<div class="filters">
	<h2>Filters</h2>
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
			on:keypress={(e) => handleEnter(e)}
			placeholder="Write here and press enter!"
		/>
	</div>
	{#if tags_open}
		<div
			transition:fly|global={{ y: 10, duration: 250 }}
			style={
				`top: ${tagsButton?.offsetTop + tagsButton?.offsetHeight}px; ` +
				`left: ${tagsButton?.offsetLeft}px;`
			}
			class="select"
		>
			<h3>Filter Tags</h3>
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

{#if posts?.length}
	{#each posts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={post} objType="posts" />
	{/each}
{:else if data.posts?.length}
	<h3>No posts matched your search :(</h3>
{:else}
{/if}

<style>
.filters {
	display: flex;
	flex-direction: column;
	background-color: rgba(255,255,255,.09);
	width: 90%;
	text-align: center;
	padding: .5rem;
	border-radius: .5rem;
	justify-content: center;
	align-items: center;
	margin-bottom: 1rem;
	max-width: 700px;
	position: relative;
}

.filters-inner {
	display: flex;
	flex-direction: row;
	width: 90%;
	text-align: center;
	justify-content: center;
	align-items: center;
}

.filters button {
	margin-right: .5rem;
}

.filters input {
	background-color: rgba(255, 255, 255, .09);
	font-size: 16px;
	border: none;
	border-radius: .5rem;
	padding: .5rem;
	color: white;
	margin: 0;
}

.select {
	position: absolute;
	background: #202020;
	padding: 0 .5rem;
	margin-top: .5rem;
	border-radius: .5rem;
	text-align: center;
}

.select-option {
	background: rgba(255, 255, 255, .09);
	margin: .5rem 0 ;
	border-radius: .5rem;
	padding: .5rem;
	cursor: pointer;
}

.select-option.selected {
	background: rgba(182, 148, 246, .5);
}
</style>