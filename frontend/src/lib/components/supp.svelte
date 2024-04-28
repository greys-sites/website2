<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import twemoji from 'twemoji';
	
	import { addModal, closeAll } from '$lib/stores/modals';

	import Edit from '$lib/components/icons/edit.svelte';
	import Delete from '$lib/components/icons/delete.svelte';

	export let obj;
	export let deleteObj;
	export let editObj;

	let editing = false;

	function del(hid) {
		deleteObj(hid)
	}

	function editOn() {
		editing = true;
	}

	function editOff() {
		editing = false;
	}
</script>

<div class="proj-item">
	{#if editing}
		<form action="/supporters?/edit" method="POST" on:submit={editOff}>
			<input type="text" name="name" placeholder="Name" bind:value={obj.name} />
			<input type="text" name="link" placeholder="Link" bind:value={obj.link} />
			<input type="hidden" name="hid" value={obj.hid} />
			<input type="submit" value="save">
		</form>
	{:else}
		{#if obj.image?.length}
			<div class="proj-cover" style={ `background-image: url('${obj.thumbnail}')` } />
		{/if}
		<div class="proj-inner">
			<h3>{@html (
				twemoji.parse(
					insane(
						marked.parse(
							obj.name
						)
					), {
						base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
					}
				)
			)}</h3>
			{#if obj.link?.length}
				<a href={obj.link} target="_blank">
					link
				</a>
			{/if}
		</div>
		{#if deleteObj}
		<div class="proj-buttons">
			<button on:click={() => editOn()}>
				<Edit />
			</button>
			<button on:click={() => addModal({
				title: "Delete item",
				message: "Do you want to delete this item?",
				type: "confirm",
				onConfirm: () => {
					addModal({
						title: "Are you sure?",
						message: "This action can't be undone.",
						type: "confirm",
						onConfirm: () => del(obj.hid)
					})
				}
			})}><Delete /></button>
		</div>
		{/if}
	{/if}
</div>

<style>
.proj-item {
	width: 90%;
	max-width: 700px;
	background: rgba(255, 255, 255, .09);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;;
	padding: .5rem;
	border-radius: .5rem;
	margin-bottom: .5rem;
}

.proj-cover {
	aspect-ratio: 1 / 1;
	width: 30%;
	max-width: 100px;
	height: auto;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin: 0 10px 0 0;
	border-radius: 10px;
}

.proj-inner {
	width: 100%;
	margin: 0;
	text-align: left;
}

.post-tag {
	padding: 5px;
	background-color: rgba(255, 255, 255, .09);
	border-radius: 5px;
	margin-right: 5px;
}

.post-tags {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

a {
	text-decoration: none;
}

h3, p {
	margin: .1rem 0;
}

.proj-buttons {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
}

.proj-buttons > * {
	margin: .1rem;
	font-size: 16px;
	cursor: pointer;
	text-align: center;
}

.draft {
	color: var(--accent);
	opacity: .5;
}
</style>