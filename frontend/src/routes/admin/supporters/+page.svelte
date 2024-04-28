<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { add as addToast } from '$lib/stores/toasts';
	import { addModal, closeAll } from '$lib/stores/modals';

	import Supp from '$lib/components/supp.svelte';
	
	export let data;

	let loading;
	let error;
	async function deleteSupp(hid) {
		// loading = true;
		try {
			var d = await fetch('/admin/api/supporters/delete', {
				method: "POST",
				body: JSON.stringify({ hid })
			})
		} catch(e) {
			console.log(e);
			closeAll()
			addToast({
				type: 'error',
				message: e,
				canClose: true,
				timeout: 5000
			});
			return;
		}

		invalidateAll()
		closeAll()
		if(d) {
			switch(d.status) {
				case 200:
					addToast({
						type: 'success',
						message: 'Supporter deleted!',
						canClose: true,
						timeout: 5000
					})
					break;
				default:
					addToast({
						type: 'error',
						message: `${d.status} - ${d.statusText}`,
						canClose: true,
						timeout: 5000
					})
					break;
			}
		}
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
		<svelte:component this={Supp} obj={sup} deleteObj={ deleteSupp }  />
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