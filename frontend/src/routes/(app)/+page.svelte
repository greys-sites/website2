<script>
	import Compact from '$lib/components/posts/compact.svelte';
	import Pin from '$lib/components/icons/pin.svelte';
	export let data;
</script>

<h1>Hi, call us <span style="color: grey">Grey</span></h1>

<h2>We make stuff. A <em>lot</em> of stuff</h2>
<p>
	From art to software to occasional streams, we love to make things!{" "}
	Check out some of our creations below, or check out the menu for{" "}
	a full list.
</p>

{#if data?.projects?.length}
	<h3><Pin /> Featured Projects</h3>
	{#each data.projects as proj (proj.hid)}
		<Compact obj={proj} objType="projects" />
	{/each}
{/if}

<style>
	p {
		width: 90%;
		font-size: 16px;
		max-width: 800px;
		text-align: center;
	}

	@media(min-width: 700px) {
		p {
			font-size: 22px;
		}
	}
</style>