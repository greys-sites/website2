<script>
	import { invalidateAll, goto } from '$app/navigation';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let categories = $state({});
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

<svelte:head>
	<title>Flags | The Grey Skies</title>
</svelte:head>

<h1>Flags</h1>

{#if data?.flags?.length}
	{#each Object.keys(categories) as cat,_ (_)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].flags as com (com.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={com} objType="flags" />
		{/each}
	{/each}
{/if}