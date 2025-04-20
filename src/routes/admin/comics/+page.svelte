<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import {
		Modal,
		Input,
		Textarea,
		Toggle,
		Button,
		Toast
	} from 'flowbite-svelte';

	import Plus from '~icons/material-symbols/add-box-rounded';
	import Minus from '~icons/material-symbols/indeterminate-check-box-rounded';
	import Check from '~icons/material-symbols/check-circle-rounded';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data, form } = $props();

	let loading;
	async function deleteComic(hid) {
	}

	let open = $state(false);
	let editing = $state(false);
	let editObj = $state(null);
	let toast = $state(false);
	let msg = $state('');
	let error = $state(null);

	let imgCount = $state(1);

	function addImg() {
		imgCount += 1;
	}

	function subImg() {
		imgCount -= 1;
		if(imgCount < 1) imgCount = 1;
	}

	let startEdit = (obj) => {
		editing = true;
		editObj = obj;
		imgCount = obj.images?.length ?? 1;
	}

	$effect(() => {
		if(form?.success) {
			open = false;
			editing = false;
			imgCount = 1;
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

<h1>Comics</h1>

<Button class="" color="alternative" onclick={() => open = true}>
	+ Add New
</Button>

{#if data?.categories && view?.value}
	{#each Object.keys(data.categories) as cat,i (i)}
		<h2>{cat.length ? cat.toUpperCase() : "UNSORTED"}</h2>
		<div class={
			'w-full max-w-[700px] mx-auto justify-center ' + view.fclass
		}>
			{#each data.categories[cat].comics as com (com.hid)}
				{@const SvelteComponent = view.value ?? VIEWS.card}
				<SvelteComponent obj={com} deleteObj={ deleteComic } editObj={startEdit} objType="comics" />
			{/each}
		</div>
	{/each}
{/if}

<Modal title="Create Comic" bind:open size="sm" autoclose={false}>
	<form method="POST" action="/admin/comics?/create" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" />
		<Input type="text" id="hid" name="hid" placeholder="hid" />
		<Input type="text" id="tagline" name="tagline" placeholder="Tagline text" />
		<Input type="text" id="thumbnail" name="thumbnail" placeholder="Thumbnail url"/>
		<Input type="text" id="story" name="story" placeholder="Story"/>
		<div class="img-setup">
			<div class="w-full flex flex-row justify-between">
				<Button type="button" size="xs" color="alternative" on:click={addImg} on:keypress={addImg}>
					<Plus />
				</Button>
				<Button type="button" size="xs" color="alternative" on:click={subImg} on:keypress={subImg}>
					<Minus />
				</Button>
			</div>
			{#each { length: imgCount } as _, i (i)}
				<div class="my-2 flex flex-row">
					<Input type="text" name="img-name" placeholder="image name" />
					<Input type="text" name="img-url" placeholder="image url" />
				</div>
			{/each}
		</div>
		<Textarea rows=10 id="description" name="description" placeholder="Description"></Textarea>
		<Button type="submit">Submit</Button>
	</form>
</Modal>

<Modal title="Edit Comic" bind:open={editing} size="sm" autoclose={false}>
	<form method="POST" action="/admin/comics?/edit" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" value={editObj.name} />
		<Input type="text" id="hid" name="hid" placeholder="hid" value={editObj.hid} />
		<Input type="text" id="tagline" name="tagline" placeholder="Tagline text" value={editObj.tagline} />
		<Input type="text" id="thumbnail" name="thumbnail" placeholder="Thumbnail url" value={editObj.thumbnail} />
		<Input type="text" id="story" name="story" placeholder="Story" value={editObj.story} />
		<div class="img-setup">
			<div class="w-full flex flex-row justify-between">
				<Button type="button" size="xs" color="alternative" on:click={addImg} on:keypress={addImg}>
					<Plus />
				</Button>
				<Button type="button" size="xs" color="alternative" on:click={subImg} on:keypress={subImg}>
					<Minus />
				</Button>
			</div>
			{#each { length: imgCount } as _, i (i)}
				<div class="my-2 flex flex-row">
					<Input type="text" name="img-name" placeholder="image name" value={editObj.images?.[i]?.name} />
					<Input type="text" name="img-url" placeholder="image url" value={editObj.images?.[i]?.url} />
				</div>
			{/each}
		</div>
		<Textarea rows=10 id="description" name="description" placeholder="Description" value={editObj.description}></Textarea>
		<Button type="submit">Submit</Button>
	</form>
</Modal>

<style>
.post-item {
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