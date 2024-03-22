<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { add as addToast } from '$lib/stores/toasts';

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
			addToast({
				type: 'error',
				message: e,
				canClose: true,
				timeout: 5000
			});
			return;
		}

		invalidateAll()
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

<h1>Blog Posts</h1>

{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<svelte:component this={selected ?? Card} obj={post} objType="posts" />
	{/each}
{/if}

<style>
.settings {
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
</style>