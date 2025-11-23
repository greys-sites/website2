<script>
	import { invalidateAll, goto } from '$app/navigation';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let categories = $state({});
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

<svelte:head>
	<title>Comics | The Aberration</title>
</svelte:head>

<h1>Comics</h1>

{#if data?.comics?.length && view?.value}
	{#each Object.keys(categories) as cat,_ (_)}
		<h2>{cat.toUpperCase()}</h2>
		<div class={
			'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
		}>
			{#each categories[cat].comics as com (com.hid)}
				{@const SvelteComponent = view.value ?? VIEWS.card}
				<SvelteComponent obj={com} objType="comics" />
			{/each}
		</div>
	{/each}
{/if}