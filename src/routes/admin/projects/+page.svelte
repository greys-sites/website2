<script>
	import { run } from 'svelte/legacy';

	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let loading;
	let error;
	async function deleteProject(hid) {
	}

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

<h1>Projects</h1>

<a class="proj-item" href="/admin/projects/create" style="color: white">
	<h3>+ Add New</h3>
</a>

{#if data?.projects?.length}
	{#each Object.keys(categories) as cat (cat.name)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].projects as proj (proj.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={proj} deleteObj={ deleteProject } objType="projects" />
		{/each}
	{/each}
{/if}

<style>
.proj-item {
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

a {
	text-decoration: none;
}

h3 {
	margin: .5rem 0;
}
</style>