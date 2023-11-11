<script>
	import { toasts } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals, closeAll } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';

	import { fade } from 'svelte/transition';

	let show = false;

	function open(e) {
		show = true;
	}

	function close(e) {
		show = false;
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

{#if show}
<div class="menu-screen" transition:fade={{ duration: 250 }} on:click={close}/>
{/if}
<div class={`menu ${show ? "open" : "closed"}`} on:click|stopPropagation>
	<a href="/">Home</a>
	<a href="/blog">Blog </a>
	<a href="/projects">Projects</a>
	<a href="/comics">Comics</a>
	<a href="/flags">Flags</a>
</div>

<slot />

<style>
.modal-screen {
	position: fixed;
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
	/*z-index: 150;*/
}

.menu-screen {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0, 0, 0, .5);
	backdrop-filter: blur(3px);
	transition: .25s;
}
</style>