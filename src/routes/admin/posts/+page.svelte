<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import Pin from '~icons/mdi/pin';

	import { settings } from '$lib/stores/settings.svelte.js';
	import { VIEWS, view } from '$lib/stores/view.svelte.js';

	/** @type {{data: any}} */
	let { data } = $props();

	let fclass = $derived(settings.get('view') == 'tiny' ? 'flex-row' : 'flex-col');

	let loading;
	let error;
	async function deletePost(hid) {
		loading = true;

		invalidateAll()
		closeAll()
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
			{@const SvelteComponent = VIEWS.compact}
			<SvelteComponent obj={post} deleteObj={ deletePost } objType="posts" />
		{/each}
	</div>

	<hr />
{/if}

{#if data?.drafts?.length}
	<h3>Drafts</h3>
	<div class={
		'w-full flex items-center justify-center mx-auto ' + fclass
	}>
		{#each data.drafts as post (post.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={ post } deleteObj={ deletePost } objType="posts" />
		{/each}
	</div>
{/if}

{#if data?.posts?.length}
	<h3>Posts</h3>
	<div class={
		'w-full flex items-center justify-center mx-auto ' + fclass
	}>
		{#each data.posts as post (post.hid)}
			{@const SvelteComponent = view.value ?? VIEWS.card}
			<SvelteComponent obj={ post } deleteObj={ deletePost } objType="posts" />
		{/each}
	</div>
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