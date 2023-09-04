<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals, closeAll } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';

	import { fade } from 'svelte/transition';

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

{#if $modals.length}
	<div on:click={closeAll} class="modal-screen" scroll="no" transition:fade={{ duration: 250 }}>
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
.modal-screen {
	position: absolute;
	top: 0;
	left: 0;
	/*height: 100%;
	width: 100%;*/
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