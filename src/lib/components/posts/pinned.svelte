<script>
	/** @type {{obj: any, deleteObj: any, objType: any}} */
	let { obj, objType } = $props();

	let apiUrl = $derived(objType == "posts" ? "blog" : objType)
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
	font-normal!
	text-sm
" href={`/${apiUrl}/${obj.hid}`}>
		{#if obj.thumbnail?.length}
			<div class="proj-cover" style={ `background-image: url('${obj.thumbnail}')` }></div>
		{:else if obj.cover_url?.length}
			<div class="proj-cover" style={ `background-image: url('${obj.cover_url}')` }></div>
		{:else}
			<div class="proj-cover" style={ `background-image: url('https://cdn.greysdawn.com/img/81fa.png')` }></div>
		{/if}
		<div class="proj-inner">
			<span>{obj.name?.length ? obj.name : obj.title}</span>
		</div>
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
	}

	.proj-inner {
		width: 100%;
		margin: 0;
		text-align: left;
	}
</style>