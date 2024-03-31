<script>
	import Compact from '$lib/components/posts/compact.svelte';
	import Pin from '$lib/components/icons/pin.svelte';
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
	or check out some things below!
</p>

{#if data?.posts?.length}
	<h3><Pin /> Pinned Posts</h3>
	{#each data.posts as post (post.hid)}
		<Compact obj={post} objType="posts" />
	{/each}
{/if}

{#if data?.projects?.length}
	<h3><Pin /> Featured Projects</h3>
	{#each data.projects as post (post.hid)}
		<Compact obj={post} objType="projects" />
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