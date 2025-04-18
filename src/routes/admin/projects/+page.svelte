<script>
	import { run } from 'svelte/legacy';

	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import {
		Modal,
		Input,
		Textarea,
		Toggle,
		Button,
		Label
	} from 'flowbite-svelte';

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

	let open = $state(false);
</script>

<h1>Projects</h1>

<Button color="alternative" onclick={() => open = true}>
	+ Add New
</Button>

{#if data?.projects?.length}
	{#each Object.keys(categories) as cat (cat.name)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].projects as proj (proj.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={proj} deleteObj={ deleteProject } objType="projects" />
		{/each}
	{/each}
{/if}

<Modal title="Create Project" bind:open size="sm" autoclose={false}>
	<form method="POST" action="/admin/projects?/create" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" />
		<Input type="text" id="hid" name="hid" placeholder="Slug" />
		<Input type="text" id="short" name="short" placeholder="Short text" />
		<Input type="text" id="cover_url" name="cover_url" placeholder="Cover image"/>
		<Input type="text" id="category" name="category" placeholder="Category"/>
		<Textarea rows=10 id="description" name="description" placeholder="Description"></Textarea>
		<div class="flex flex-row w-full justify-between">
			<Label for="featured">Featured?</Label>
			<Toggle name="featured"/>
		</div>
		<Button type="submit">Submit</Button>
	</form>
</Modal>

<style>
a {
	text-decoration: none;
}

h3 {
	margin: .5rem 0;
}
</style>