<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { add as addToast } from '$lib/stores/toasts';
	import { addModal, closeAll } from '$lib/stores/modals';

	import Card from '$lib/components/posts/card.svelte';
	import Compact from '$lib/components/posts/compact.svelte';

	import Pin from '$lib/components/icons/pin.svelte';

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
	async function deletePost(hid) {
		loading = true;
		try {
			var d = await fetch('/admin/api/posts/delete', {
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
		console.log(d);
		if(d) {
			switch(d.status) {
				case 200:
					addToast({
						type: 'success',
						message: 'Post deleted!',
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

	async function save() {
		try {
			var d = await fetch('/api/settings', {
				method: "POST",
				body: JSON.stringify({
					view_type: selected.name
				})
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
						message: 'Settings saved!',
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

<h1>Posts</h1>

<a class="post-item" href="/admin/posts/create" style="color: white">
	<h3>+ Add New</h3>
</a>

{#if data?.pinned?.length}
	<div class="pinned">
		<h3><Pin /> Pinned</h3>
		{#each data.pinned as post (post.hid)}
			<Compact obj={post} deleteObj={ deletePost } objType="posts" />
		{/each}
	</div>

	<hr />
{/if}

{#if data?.drafts?.length}
	{#each data.drafts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={ post } deleteObj={ deletePost } objType="posts" />
	{/each}
{/if}

{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={ post } deleteObj={ deletePost } objType="posts" />
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

.pinned {
	width: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

a {
	text-decoration: none;
}

h3 {
	margin: .5rem 0;
}
</style>