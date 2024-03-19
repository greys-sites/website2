<script>
	import Card from '$lib/components/posts/card.svelte';
	export let data;
</script>

<h1>Blog Posts</h1>
{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<Card obj={post} objType="posts" />
	{/each}
{/if}