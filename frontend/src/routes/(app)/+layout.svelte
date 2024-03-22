<script>
	import { toasts, add as addToast } from '$lib/stores/toasts';
	import Toast from '$lib/components/toast.svelte';

	import { modals, closeAll } from '$lib/stores/modals';
	import Modal from '$lib/components/modal.svelte';

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll, goto } from '$app/navigation';
	
	export let data;

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
	<button on:click|preventDefault|stopPropagation={show ? close : open}>menu</button>
</nav>

{#if $modals.length}
	<div on:click={closeAll} class="modal-screen" scroll="no" transition:fade|global={{ duration: 250 }}>
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
<div class="menu-screen" transition:fade|global={{ duration: 250 }} on:click={close}/>
{/if}
<div class={`menu ${show ? "open" : "closed"}`} on:click|stopPropagation>
	<a href="/">Home</a>
	<a href="/blog">Blog </a>
	<a href="/projects">Projects</a>
	<a href="/comics">Comics</a>
	<a href="/flags">Flags</a>
	{#if data?.user}<a href="/admin">Dash</a>{/if}

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

.settings {
	align-self: flex-end;
	text-align: center;
}
</style>