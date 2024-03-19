<script>
	import Card from '$lib/components/posts/card.svelte';
	export let data;

	let categories = {};
	for(let p of data.comics) {
		if(!categories[p.story]) {
			categories[p.story] = {
				name: p.story,
				comics: [p]
			};
		} else {
			categories[p.story].comics.push(p)
		}
	}
</script>

<h1>Comics</h1>
{#if data?.comics?.length}
	{#each Object.keys(categories) as cat (cat.name)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].comics as com (com.hid)}
			<Card obj={com} objType="comics" />
		{/each}
	{/each}
{/if}

<style>
	a {
		text-decoration: none;
	}

	h3, p {
		margin: .5rem 0;
	}
</style>