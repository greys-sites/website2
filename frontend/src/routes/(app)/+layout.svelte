<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';
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

{#if $modals.length}
	<div class="modal-screen" scroll="no">
		{#each $modals as m (m.id)}
			<Modal
				props={m}
			/>
		{/each}
	</div>
{/if}

<div class="toasts">
	{#each $toasts as t (t.id)}
		<Toast
			props={t}
		/>
	{/each}
</div>

<slot />

<style>
.modal-screen {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0, 0, 0, .5);
	backdrop-filter: blur(3px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 150;
}
</style>