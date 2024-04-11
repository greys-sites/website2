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
					<div class="post-tags">
						{#each obj.full_tags as t (t.hid)}
							<div class="post-tag">{t.name}</div>
						{/each}
					</div>
				</div>
			{/if}
			{#if obj.tagline?.length}<p>{obj.tagline}</p>{/if}
			{#if obj.short?.length}<p>{obj.short}</p>{/if}
			{#if obj.draft}<p class="draft"><em>Draft</em></p>{/if}
		</div>
	{#if deleteObj}
	<div class="proj-buttons">
		<a class="link-button" target="_blank" href={`/admin/${objType}/edit/${obj.hid}`}>
			<Edit />
		</a>
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