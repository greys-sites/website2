<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { add as addToast } from '$lib/stores/toasts';
	import { addModal, closeAll } from '$lib/stores/modals';

	import Card from '$lib/components/posts/card.svelte';
	import Compact from '$lib/components/posts/compact.svelte';

	export let data;

	let views = {
		'card': Card,
		'compact': Compact
	}

	$: selected = (
		views[data?.settings?.view_type] ??
		views['card']
	);

	let loading;
	let error;
	async function deleteComic(hid) {
		// loading = true;
		try {
			var d = await fetch('/admin/api/comics/delete', {
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
						message: 'Comic deleted!',
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

<h1>Comics</h1>

<a class="post-item" href="/admin/comics/create" style="color: white">
	<h3>+ Add New</h3>
</a>

{#if data?.categories}
	{#each Object.keys(data.categories) as cat,i (i)}
		<h2>{cat.length ? cat.toUpperCase() : "UNSORTED"}</h2>
		{#each data.categories[cat].comics as com (com.hid)}
			<svelte:component this={selected ?? Card} obj={com} deleteObj={ deleteComic } objType="comics" />
		{/each}
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