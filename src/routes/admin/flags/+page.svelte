<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let loading;
	let error;
	async function deleteFlag(hid) {
	}
</script>

<h1>Flags</h1>

<a class="post-item" href="/admin/flags/create" style="color: white">
	<h3>+ Add New</h3>
</a>

{#if data?.categories}
	{#each Object.keys(data.categories) as cat,i (i)}
		<h2>{cat.length ? cat.toUpperCase() : "UNSORTED"}</h2>
		{#each data.categories[cat].flags as com (com.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={com} deleteObj={ deleteFlag } objType="flags" />
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