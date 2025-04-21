<script>
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils';
	import { view } from '$lib/stores/view.svelte.js';

	import {
		Button
	} from 'flowbite-svelte';

	import Edit from '~icons/material-symbols/edit';
	import Delete from '~icons/material-symbols/delete-rounded';
	import Check from '~icons/icon-park-solid/check-one';
	import Cancel from '~icons/material-symbols/cancel-rounded';

	/** @type {{obj: any, deleteObj: any, objType: any}} */
	let { obj, deleteObj, editObj, objType, changeTags } = $props();

	let apiUrl = $derived(objType == "posts" ? "blog" : objType)
	let del = $state(false);
</script>

<a class="
	w-9/10 max-w-[700px]
	bg-white dark:bg-gray-800
	hover:bg-gray-200 dark:hover:bg-gray-700
	border border-gray-200 dark:border-gray-700
	shadow-gray-400 shadow-md dark:shadow-none
	hover:-translate-y-1
	transition-all
	flex flex-row items-center justify-around p-2 rounded-lg mb-2
	cursor-pointer
	no-underline hover:no-underline
" href={`/${apiUrl}/${obj.hid}`}>
		{#if obj.thumbnail?.length}
			<div class="proj-cover" style={ `background-image: url('${obj.thumbnail}')` }></div>
		{:else if obj.cover_url?.length}
			<div class="proj-cover" style={ `background-image: url('${obj.cover_url}')` }></div>
		{:else}
			<div class="proj-cover" style={ `background-image: url('https://cdn.greysdawn.com/img/81fa.png')` }></div>
		{/if}
		<div class="proj-inner">
			<h3>{obj.name?.length ? obj.name : obj.title}</h3>
			{#if objType == "posts"}
				<div class="post-meta">
					<p>{formatDate(obj.post_timestamp, view.date)}</p>
					<div class="post-tags" onclick={(e) => e.preventDefault()}>
						{#each obj.full_tags as t (t.hid)}
							<Button
								color="alternative"
								size="xs"
								class="mr-1"
								onclick={() => changeTags(t.name)}
							>
								{t.name}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
			{#if obj.tagline?.length}<p>{obj.tagline}</p>{/if}
			{#if obj.short?.length}<p>{obj.short}</p>{/if}
			{#if obj.draft}<p class="draft"><em>Draft</em></p>{/if}
		</div>
	{#if deleteObj}
		<div class="proj-buttons" onclick={(e) => { e.stopPropagation(); }}>
			{#if del}
				<form use:enhance action='/admin?/del' method="POST">
					<input type='hidden' name='hid' value={obj.hid} />
					<input type='hidden' name='type' value={objType} />
					<Button color="alternative" size="xs" class="mb-3" type="submit"><Check /></Button>
				</form>
				<Button color="alternative" size="xs" class="mt-3" onclick={(e) => {
					e.preventDefault();
					del = false;
				}}><Cancel /></Button>
			{:else}
				<Button color="alternative" size="xs" class="mb-3" onclick={(e) => {
					e.preventDefault();
					editObj(obj)
				}}><Edit /></Button>
				<Button color="alternative" size="xs" class="mt-3" onclick={(e) => {
					e.preventDefault();
					del = true;
				}}><Delete /></Button>
			{/if}
		</div>
	{/if}
</a>

<style>
	@reference "tailwindcss";

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

	.proj-inner p {
		font-weight: normal;
	}

	.post-tags {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	h3, p {
		margin: .1rem 0;
	}

	.proj-buttons {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		align-items: space-between;
		justify-content: space-between;
	}

	.draft {
		color: var(--accent);
		opacity: .5;
	}
</style>