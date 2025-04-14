<script>
	import { preventDefault, stopPropagation, createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import '../../app.css';

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll, goto } from '$app/navigation';

	import {
		DarkMode
	} from 'flowbite-svelte';
	
	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();

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
	>menu</button>
	<DarkMode />
</nav>

{#if show}
<div class="menu-screen" transition:fade|global={{ duration: 250 }} onclick={close} onkeypress={close}></div>
{/if}
<div class={`menu ${show ? "open" : "closed"}`} onclick={stopPropagation(bubble('click'))} onkeypress={stopPropagation(bubble('keypress'))}>
	<a href="/">Home</a>
	<a href="/about">About Us</a>
	<a href="/blog">Blog </a>
	<a href="/projects">Projects</a>
	<a href="/comics">Comics</a>
	<a href="/flags">Flags</a>
	<a href="/supporters">Supporters</a>
	{#if data?.user}<a href="/admin">Dash</a>{/if}

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