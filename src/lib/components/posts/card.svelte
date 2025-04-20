<script>
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils';

	import {
		Button
	} from 'flowbite-svelte';

	/** @type {{obj: any, deleteObj: any, objType: any}} */
	let { obj, deleteObj, objType, editObj } = $props();

	let apiUrl = $derived(objType == "posts" ? "blog" : objType)

	function del(hid) {
		deleteObj(hid)
	}
</script>

<a class="
	w-9/10 max-w-[700px]
	bg-white dark:bg-gray-800
	hover:bg-gray-200 dark:hover:bg-gray-700
	border border-gray-200 dark:border-gray-700
	shadow-gray-400 shadow-md dark:shadow-none
	hover:-translate-y-1
	transition-all
	flex flex-col items-center justify-center px-2 rounded-lg mb-2
	cursor-pointer
	no-underline hover:no-underline
" href={`/${apiUrl}/${obj.hid}`}>
	{#if obj.thumbnail?.length}
		<img alt="Item thumbnail" class="proj-cover" src={ obj.thumbnail } />
	{:else if obj.cover_url?.length}
		<img alt="Item thumbnail" class="proj-cover" src={ obj.cover_url } />
	{:else}
		<img alt="Item thumbnail" class="proj-cover" src="https://cdn.greysdawn.com/img/81fa.png" />
	{/if}
	<div class="proj-inner">
		<h1>{obj.name?.length ? obj.name : obj.title}</h1>
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
		{#if obj.draft}<p class="draft"><em>Draft</em></p>{/if}
	</div>
	{#if deleteObj}
		<div class="proj-buttons mb-2" onclick={(e) => { e.stopPropagation(); }}>
			<Button color="alternative" size="xs" class="mr-4" onclick={(e) => {
				e.preventDefault();
				editObj(obj)
			}}>EDIT</Button>
			<form use:enhance action='/admin?/del' method="POST">
				<input type='hidden' name='hid' value={obj.hid} />
				<input type='hidden' name='type' value={objType} />
				<Button color="alternative" size="xs" class="ml-4" type="submit">DELETE</Button>
			</form>
		</div>
	{/if}
</a>

<style>
	@reference "tailwindcss";

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

	.proj-inner p {
		font-weight: normal;
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

	.draft {
		color: var(--accent);
		opacity: .5;
	}
</style>