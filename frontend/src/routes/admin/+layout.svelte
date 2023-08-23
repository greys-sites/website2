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
	<button on:click|preventDefault|stopPropagation={show ? close : open}>menu</button>
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
</style>