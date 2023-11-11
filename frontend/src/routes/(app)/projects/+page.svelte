<script>
	import Project from '$lib/components/posts/project.svelte';
	export let data;

	let categories = {};
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
{#if data?.projects?.length}
	{#each Object.keys(categories) as cat (cat.name)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].projects as proj (proj.hid)}
			<Project project={proj} />
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