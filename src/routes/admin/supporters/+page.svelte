<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import Supp from '$lib/components/Supp.svelte';
	
	/** @type {{data: any}} */
	let { data } = $props();

	let loading;
	let error;
	async function deleteSupp(hid) {
	}
</script>

<h1>Supporters</h1>

<div class="post-item">
	<h3>Add New</h3>
	<form action="?/create" method="POST" use:enhance>
		<input type="text" name="name" placeholder="Name" />
		<input type="text" name="link" placeholder="Link" />
		<input type="submit" value="submit" />
	</form>
</div>

{#if data?.supporters}
	{#each data.supporters as sup (sup.hid)}
		<Supp obj={sup} deleteObj={ deleteSupp }  />
	{/each}
{/if}

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