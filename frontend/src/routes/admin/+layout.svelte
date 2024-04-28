<script>
	import { toasts, add as addToast } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals, closeAll } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll, goto } from '$app/navigation';
	
	let show = false;

	let views = [
		{
			name: 'card'
		},
		{
			name: 'compact'
		}
	];

	$: vt = $page.data?.settings?.view_type;
	let selected = (
		views.find(x => x.name == $page.data?.settings?.view_type)
		?? views[0]
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
		on:click|preventDefault|stopPropagation={show ? close : open}
		on:keypress|preventDefault|stopPropagation={show ? close : open}
		aria-label={ show ? "close menu" : "open menu" }
	>menu</button>
</nav>

{#if $modals.length}
	<div on:click={closeAll} on:keypress={closeAll} class="modal-screen" scroll="no" transition:fade|global={{ duration: 250 }}>
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
<div class="menu-screen" transition:fade|global={{ duration: 250 }} on:click={close} on:keypress={close}/>
{/if}
<div
	class={`menu ${show ? "open" : "closed"}`}
	on:click|stopPropagation
	on:keypress|stopPropagation
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
		<select name="view_type" id="view_type" bind:value={selected} on:change={() => save()}>
			{#each views as view,_ (_)}
				<option value={view}>
					{view.name}
				</option>
			{/each}
		</select>
	</div>
</div>

<slot />

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