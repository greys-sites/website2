<script>
	import Compact from '$lib/components/posts/compact.svelte';
	export let data;

	
</script>

<h1>Hi, call us <span style="color: grey">Grey</span></h1>

<p>
	We're a collective of folks who like to make stuff.{" "}
	We're best known for the bots we've made, but we also{" "}
	make websites like this one and occasional art pieces.
</p>
<p>
	Check out the sidebar for links to things we've made,{" "}
	or check out our recent blog posts below!
</p>

<h3>Recent Posts</h3>
{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<Compact obj={post} objType="posts" />
	{/each}
{/if}

<style>
	p {
		width: 90%;
		font-size: 16px;
		max-width: 800px;
	}

	@media(min-width: 700px) {
		p {
			font-size: 22px;
		}
	}
</style>