<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { add as addToast } from '$lib/stores/toasts';

	import Card from '$lib/components/posts/card.svelte';
	import Compact from '$lib/components/posts/compact.svelte';

	export let data;

	let views = {
		'card': Card,
		'compact': Compact
	}

	$: selected = (
		views[data?.settings?.view_type] ??
		views['card']
	);

	let posts = data.posts;

	let sorts = [
		{
			'name': 'old to new',
			'value': 'asc'
		},
		{
			'name': 'new to old',
			'value': 'desc'
		}
	]

	let filters = {
		sort: sorts[1],
		tags: [],
		search: ''
	}

	function handleEnter(e) {
		if(e.key == 'Enter') search();
	}

	let timeout;
	function set() {
		if(timeout) clearTimeout(timeout);
		timeout = setTimeout(()=> search(), 500)
	}

	function search() {
		console.log(filters)
		posts = data.posts.filter(p => {
			let s, t;
			if(!filters.search?.length) s = true;
			else if(p.title.toLowerCase().includes(search)) s = true;
			else s = false;

			if(!filters.tags?.length) t = true;
			else {
				let ftags = filters.tags.filter(x => {
					return p.tags.find(xt => xt.name == x)
				})
				if(ftags.length == filters.tags) t = true;
				else t = false;
			}

			return (s && t);
		})

		posts = posts.sort((a, b) => a.id - b.id);
		if((filters.sort?.value ?? 'desc') == 'desc') return posts.reverse();
		else return posts;
	}
</script>

<h1>Blog Posts</h1>

<div class="filters">
	<h2>Filters</h2>
	<label for="search">Search</label>
	<input type="text" bind:value={filters.search} on:keypress={handleEnter} placeholder="Enter search query..." />
	<label for="tags">Tag filter</label>
	<select multiple bind:value={filters.tags} on:change={() => set()}>
		{#each data.tags as tag (tag.hid)}
			<option value={tag.name}>
				{tag.name}
			</option>
		{/each}
	</select>
	<label for="tags">Post sorting</label>
	<select bind:value={filters.sort} on:change={() => set()}>
		{#each sorts as opt,_ (_)}
			<option value={opt}>
				{opt.name}
			</option>
		{/each}
	</select>
</div>

{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={post} objType="posts" />
	{/each}
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
}
</style>