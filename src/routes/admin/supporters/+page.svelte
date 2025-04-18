<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import {
		Modal,
		Input,
		Textarea,
		Toggle,
		Button,
		Label
	} from 'flowbite-svelte';

	import Supp from '$lib/components/Supp.svelte';
	
	/** @type {{data: any}} */
	let { data } = $props();

	let loading;
	let error;
	async function deleteSupp(hid) {
	}

	let open = $state(false);
</script>

<h1>Supporters</h1>

<Button color="alternative" onclick={() => open = true}>
	+ Add New
</Button>

{#if data?.supporters}
	{#each data.supporters as sup (sup.hid)}
		<Supp obj={sup} deleteObj={ deleteSupp }  />
	{/each}
{/if}

<Modal title="Add Supporter" bind:open size="sm" autoclose={false}>
	<form method="POST" action="/admin/supporters?/create" use:enhance class="flex flex-col space-y-6">
		<Input type="text" id="name" name="name" placeholder="Name" />
		<Input type="text" id="link" name="link" placeholder="Link" />
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
	padding: .5rem;
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