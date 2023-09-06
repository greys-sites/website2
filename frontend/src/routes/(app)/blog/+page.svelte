<script>
	import Post from '$lib/components/posts/post.svelte';
	export let data;
</script>

<h1>Blog Posts</h1>
{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<Post { post } />
	{/each}
{/if}