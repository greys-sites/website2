<script>
	import { invalidateAll, goto } from '$app/navigation';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let categories = $state({});
	for(let p of data.projects) {
		if(!categories[p.category]) {
			categories[p.category] = {
				name: p.category,
				projects: [p]
			};
		} else {
			categories[p.category].projects.push(p)
		}
	}
</script>

<svelte:head>
	<title>Projects | The Grey Skies</title>
</svelte:head>

<h1>Projects</h1>

{#if data?.projects?.length}
	{#each Object.keys(categories) as cat,_ (_)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].projects as proj (proj.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={proj} objType="projects" />
		{/each}
	{/each}
{/if}