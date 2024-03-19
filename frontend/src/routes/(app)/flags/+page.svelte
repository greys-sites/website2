<script>
	import Card from '$lib/components/posts/card.svelte';
	export let data;

	let categories = {};
	for(let p of data.flags) {
		if(!categories[p.category]) {
			categories[p.category] = {
				name: p.category,
				flags: [p]
			};
		} else {
			categories[p.category].flags.push(p)
		}
	}
</script>

<h1>Flags</h1>
{#if data?.flags?.length}
	{#each Object.keys(categories) as cat (cat.name)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].flags as com (com.hid)}
			<Card obj={com} objType="flags" />
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