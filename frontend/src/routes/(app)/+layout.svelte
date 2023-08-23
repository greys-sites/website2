<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';
</script>

<nav>
	<a href="/">home</a>
	<p>|</p>
	<a href="/blog">blog </a>
	<p>|</p>
	<a href="/projects">projects</a>
	<p>|</p>
	<a href="/comics">comics</a>
	<p>|</p>
	<a href="/flags">flags</a>
</nav>

<div class="toasts">
	{#each $toasts as t (t.id)}
		<Toast
			props={t}
		/>
	{/each}
</div>

<slot />

<style>
</style>