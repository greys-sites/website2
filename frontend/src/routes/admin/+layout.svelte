<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	let show = false;

	function open(e) {
		show = true;
		document.body.addEventListener('click', close);
	}

	function close(e) {
		show = false;
		document.body.removeEventListener('click', close);
	}
</script>

<nav>
	<button on:click|stopPropagation={show ? close : open}>menu</button>
</nav>

<div class="toasts">
	{#each $toasts as t (t.id)}
		<Toast
			props={t}
		/>
	{/each}
</div>

<div class={`menu ${show ? "open" : "closed"}`}>
	<a href="/">home</a>
	<a href="/admin">dash</a>
	<a href="/admin/posts">posts</a>
	<a href="/admin/projects">projects</a>
	<a href="/admin/comics">comics</a>
	<a href="/admin/flags">flags</a>
	<a href="/admin/users">users</a>
</div>

<slot />

<style>
	nav {
		background-color: rgba(255, 255, 255, .07);
		height: 2em;
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