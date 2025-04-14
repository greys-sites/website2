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

	let categories = {};
	for(let p of data.comics) {
		if(!categories[p.story]) {
			categories[p.story] = {
				name: p.story,
				comics: [p]
			};
		} else {
			categories[p.story].comics.push(p)
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

<svelte:head>
	<title>Comics | The Grey Skies</title>
</svelte:head>

<h1>Comics</h1>

{#if data?.comics?.length}
	{#each Object.keys(categories) as cat,_ (_)}
		<h2>{cat.toUpperCase()}</h2>
		{#each categories[cat].comics as com (com.hid)}
			<svelte:component this={selected ?? Card} obj={com} objType="comics" />
		{/each}
	{/each}
{/if}