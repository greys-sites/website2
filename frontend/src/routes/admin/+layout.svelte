<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	let open = false;

	function toggle(e) {
		open = !open;
	}
</script>

<nav>
	<button on:click|preventDefault={toggle}>menu</button>
</nav>

<div class="toasts">
	{#each $toasts as t (t.id)}
		<Toast
			props={t}
		/>
	{/each}
</div>

<div class={`menu ${open ? "open" : "closed"}`}>
	<a href="/">home</a>
	<a href="/admin">dash</a>
	<a href="/admin/posts">blog </a>
	<a href="/admin/projects">projects</a>
	<a href="/admin/comics">comics</a>
	<a href="/admin/flags">flags</a>
	<a href="/admin/users">users</a>
</div>

<slot />

<style>
	nav {
		background-color: rgba(255, 255, 255, .07);
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding-left: .5rem;
		margin: 0;
		position: sticky;
		top: 0;
		left: 0;
	}

	nav > * {
		margin-right: .5rem;
	}

	.toasts {
		position: fixed;
		top: 0;
		right: 0;
		width: 18rem;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: center;
	}
</style>