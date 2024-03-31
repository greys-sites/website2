<script>
	import { addModal, closeAll } from '$lib/stores/modals';
	import { formatDate } from '$lib/utils';

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
		<img alt="Item thumbnail" class="proj-cover" src={ obj.thumbnail } />
	{:else if obj.cover_url?.length}
		<img alt="Item thumbnail" class="proj-cover" src={ obj.cover_url } />
	{:else}
		<img alt="Item thumbnail" class="proj-cover" src="https://cdn.greysdawn.com/img/81fa.png" />
	{/if}
	<div class="proj-inner">
		<h1><a href={`/${apiUrl}/${obj.hid}`} target="__blank">{obj.name?.length ? obj.name : obj.title}</a></h1>
		{#if objType == "posts"}
			<div class="post-meta">
				<p>{formatDate(obj.post_timestamp)} |</p>
				{#each obj.full_tags as t (t.hid)}
					<div class="post-tag">{t.name}</div>
				{/each}
			</div>
		{/if}
		{#if obj.tagline?.length}<p>{obj.tagline}</p>{/if}
		{#if obj.short?.length}<p>{obj.short}</p>{/if}
	</div>
	{#if deleteObj}
	<div class="proj-buttons">
		<a class="link-button" target="__blank" href={`/admin/${objType}/edit/${obj.hid}`}>edit</a>
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
		})}>delete</button>
	</div>
	{/if}
</div>

<style>
.proj-item {
	width: 90%;
	max-width: 700px;
	background: rgba(255, 255, 255, .09);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 0 .5rem;
	border-radius: .5rem;
	margin-bottom: .5rem;
}

.proj-cover {
	width: 100%;
	max-width: 700px;
	height: auto;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin: 10px 0;
	border-radius: 10px;
}

.proj-inner {
	width: 100%;
	margin-bottom: 10px;
	text-align: center;
}

.post-tag {
	padding: 5px;
	background-color: rgba(255, 255, 255, .09);
	border-radius: 5px;
	margin-right: 5px;
}

.post-meta {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.post-meta p {
	margin-right: 5px;
}

a {
	text-decoration: none;
}

h1, p {
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