<script>
	import { addModal, closeAll } from '$lib/stores/modals';
	import { formatDate } from '$lib/utils';

	import Edit from '$lib/components/icons/edit.svelte';
	import Delete from '$lib/components/icons/delete.svelte';

	export let obj;
	export let deleteObj;
	export let objType;

	$: apiUrl = objType == "posts" ? "blog" : objType

	function del(hid) {
		deleteObj(hid)
	}
</script>

<div class="proj-item">
	{#if obj.thumbnail?.length}
		<div class="proj-cover" style={ `background-image: url('${obj.thumbnail}')` } />
	{:else if obj.cover_url?.length}
		<div class="proj-cover" style={ `background-image: url('${obj.cover_url}')` } />
	{:else}
		<div class="proj-cover" style={ `background-image: url('https://cdn.greysdawn.com/img/81fa.png')` } />
	{/if}
	<div class="proj-inner">
		<h3><a href={`/${apiUrl}/${obj.hid}`} target="_blank">{obj.name?.length ? obj.name : obj.title}</a></h3>
		{#if objType == "posts"}
			<div class="post-meta">
				<p>{formatDate(obj.post_timestamp)}</p>
			</div>
		{/if}
	</div>
	{#if deleteObj}
	<div class="proj-buttons">
		<a class="link-button" target="_blank" href={`/admin/${objType}/edit/${obj.hid}`}><Edit /></a>
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
</div>

<style>
.proj-item {
	/*width: 25%;*/
	width: 150px;
	background: rgba(255, 255, 255, .09);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: .5rem;
	border-radius: .5rem;
	margin-right: .5rem;
}

.proj-cover {
	aspect-ratio: 1 / 1;
	width: 100%;
	max-width: 150px;
	height: auto;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin: 0;
	border-radius: 10px;
}

.proj-inner {
	width: 100%;
	text-align: center;
}

a {
	text-decoration: none;
}

h3, p {
	margin: .5rem 0;
}

.proj-buttons {
	display: flex;
	flex-direction: row;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
}

.proj-buttons > * {
	margin: 5px;
	font-size: 16px;
	cursor: pointer;
}
</style>