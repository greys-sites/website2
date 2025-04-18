<script>
	import { run } from 'svelte/legacy';

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import insane from 'insane';
	import twemoji from 'twemoji';

	import {
		Button
	} from 'flowbite-svelte';
	
	import Edit from '~icons/material-symbols/edit';
	import Delete from '~icons/material-symbols/delete-rounded';

	/** @type {{obj: any, deleteObj: any, editObj: any}} */
	let { obj = $bindable(), deleteObj, editObj } = $props();


	let editing = $state(false);

	function del(hid) {
		deleteObj(hid)
	}

	function editOn() {
		editing = true;
	}

	function editOff() {
		editing = false;
	}

	$effect(() => {
		if($page?.form?.data?.hid == obj.hid) {
			editOff();
		}
	})
</script>

<div class="
	w-9/10 max-w-[700px]
	bg-white dark:bg-gray-800
	hover:bg-gray-200 dark:hover:bg-gray-700
	border border-gray-200 dark:border-gray-700
	shadow-gray-400 shadow-md dark:shadow-none
	hover:-translate-y-1
	transition-all
	flex flex-row items-center justify-around p-2 rounded-lg m-2
	cursor-pointer
	no-underline hover:no-underline
">
	<div class="proj-inner">
		<h3>{@html (
			twemoji.parse(
				insane(
					obj.name
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
		<Button color="alternative" size="xs" onclick={() => editOn()}>
			<Edit />
		</Button>
		<Button color="alternative" size="xs"><Delete /></Button>
	</div>
	{/if}
</div>

<style>
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