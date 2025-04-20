<script>
	import { run } from 'svelte/legacy';

	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import {
		Modal,
		Input,
		Textarea,
		Toggle,
		Button,
		Label,
		Toast
	} from 'flowbite-svelte';

	import Check from '~icons/material-symbols/check-circle-rounded';

	import { settings } from '$lib/stores/settings.svelte.js';
	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data, form } = $props();

	let loading;
	async function deleteProject(hid) {
	}

	let categories = $derived.by(() => {
		let cats = {}
		for(let p of data.projects) {
			if(!cats[p.category]) {
				cats[p.category] = {
					name: p.category,
					projects: [p]
				};
			} else {
				cats[p.category].projects.push(p)
			}
		}

		return cats
	});

	let open = $state(false);
	let editing = $state(false);
	let editObj = $state(null);

	let toast = $state(false);
	let msg = $state('');
	let error = $state(null);

	let startEdit = (obj) => {
		editing = true;
		editObj = obj;
	}

	$effect(() => {
		if(form?.success) {
			open = false;
			editing = false;
			toast = true;
			msg = form.type;
			setTimeout(() => toast = false, 5_000);
		}
	})
</script>

<Toast bind:toastStatus={toast} color="green" position="top-right" class="top-16 lg:right-66 lg:top-4" >
	<Check slot='icon' />
	Post successfully {msg}!
</Toast>

<h1>Projects</h1>

<Button color="alternative" onclick={() => open = true}>
	+ Add New
</Button>

{#if data?.projects?.length && view?.value}
	{#each Object.keys(categories).sort() as cat,_ (_)}
		<h2>{cat.toUpperCase()}</h2>
		<div class={
			'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
		}>
			{#each categories[cat].projects as proj (proj.hid)}
				{@const SvelteComponent = view.value ?? VIEWS.card}
				<SvelteComponent obj={proj} deleteObj={ deleteProject } editObj={ startEdit } objType="projects" />
			{/each}
		</div>
	{/each}
{/if}

<Modal title="Create Project" bind:open size="sm" autoclose={false}>
	<form method="POST" action="/admin/projects?/create" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" />
		<Input type="text" id="hid" name="hid" placeholder="hid" />
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

<Modal title="Edit Project" bind:open={editing} size="sm" autoclose={false}>
	<form method="POST" action="/admin/projects?/edit" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" value={editObj.name} />
		<Input type="text" id="hid" name="hid" placeholder="hid" value={editObj.hid} />
		<Input type="text" id="short" name="short" placeholder="Short text" value={editObj.short} />
		<Input type="text" id="cover_url" name="cover_url" placeholder="Cover image" value={editObj.cover_url} />
		<Input type="text" id="category" name="category" placeholder="Category" value={editObj.category} />
		<Textarea rows=10 id="description" name="description" placeholder="Description" value={editObj.description}></Textarea>
		<div class="flex flex-row w-full justify-between">
			<Label for="featured">Featured?</Label>
			<Toggle name="featured" checked={editObj.featured} />
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