<script>
	import { preventDefault, stopPropagation, createBubbler } from 'svelte/legacy';
	import { DarkMode } from 'flowbite-svelte';

	const bubble = createBubbler();
	import '../../app.css';
	
	import { toasts, add as addToast } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals, closeAll } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll, goto } from '$app/navigation';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	
	let show = $state(false);

	let views = [
		{
			name: 'card'
		},
		{
			name: 'compact'
		}
	];

	let vt = $derived($page.data?.settings?.view_type);
	let selected = (
		$state(views.find(x => x.name == $page.data?.settings?.view_type)
		?? views[0])
	);

	function open(e) {
		show = true;
	}

	function close(e) {
		show = false;
	}

	async function save() {
		try {
			var d = await fetch('/api/settings', {
				method: "POST",
				body: JSON.stringify({
					view_type: selected.name
				})
			})
		} catch(e) {
			console.log(e);
			closeAll()
			addToast({
				type: 'error',
				message: e,
				canClose: true,
				timeout: 5000
			});
			return;
		}

		invalidateAll()
		closeAll()
		if(d) {
			switch(d.status) {
				case 200:
					addToast({
						type: 'success',
						message: 'Settings saved!',
						canClose: true,
						timeout: 5000
					})
					break;
				default:
					addToast({
						type: 'error',
						message: `${d.status} - ${d.statusText}`,
						canClose: true,
						timeout: 5000
					})
					break;
			}
		}
	}
</script>

<nav>
	<button
		onclick={stopPropagation(preventDefault(show ? close : open))}
		onkeypress={stopPropagation(preventDefault(show ? close : open))}
		aria-label={ show ? "close menu" : "open menu" }
	>menu</button>
	<DarkMode />
</nav>

{#if $modals.length}
	<div onclick={closeAll} onkeypress={closeAll} class="modal-screen" scroll="no" transition:fade|global={{ duration: 250 }}>
		{#each $modals as m (m.id)}
			<Modal
				props={m}
			/>
		{/each}
	</div>
{/if}

<div class="toasts" style={ 'z-index: 300;' }>
	{#each $toasts as t (t.id)}
		<Toast
			props={t}
		/>
	{/each}
</div>

{#if show}
<div class="menu-screen" transition:fade|global={{ duration: 250 }} onclick={close} onkeypress={close}></div>
{/if}
<div
	class={`menu ${show ? "open" : "closed"}`}
	onclick={stopPropagation(bubble('click'))}
	onkeypress={stopPropagation(bubble('keypress'))}
	aria-hidden={ show ? false : true }
	focusable={ show ? true : false }
>
	<a href="/">home</a>
	<a href="/admin">dash</a>
	<a href="/admin/posts">posts</a>
	<a href="/admin/projects">projects</a>
	<a href="/admin/comics">comics</a>
	<a href="/admin/flags">flags</a>
	<a href="/admin/supporters">supporters</a>

	<div class="settings">
		<p><b>Settings</b></p>
		<label for="view_type">view type</label>
		<select name="view_type" id="view_type" bind:value={selected} onchange={() => save()}>
			{#each views as view,_ (_)}
				<option value={view}>
					{view.name}
				</option>
			{/each}
		</select>
	</div>
</div>

{@render children?.()}

<style>
.menu-screen {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0, 0, 0, .7);
	transition: .25s;
	z-index: 10;
}

.settings {
	align-self: flex-end;
	text-align: center;
}

option {
	color: white;
	background-color: #202020;
}
</style>