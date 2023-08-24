<script>
	export let data;
</script>

<h1>Posts</h1>

<a class="post-item" href="/admin/posts/create" style="color: white">
	<h3>+ Add New</h3>
</a>

{#if data?.posts?.length}
	{#each data.posts as post (post.hid)}
		<div class="post-item">
			<div class="post-inner">
				<h3><a href={`/blog/${post.hid}`}>{post.title}</a></h3>
				<p>{post.short}</p>
			</div>
			<div class="post-buttons">
				<a class="link-button" href={`/admin/posts/edit/${post.hid}`}>edit</a>
				<button on:click={() => {}}>delete</button>
			</div>
		</div>
	{/each}
{/if}

<style>
.post-item {
	width: 90%;
	background: rgba(255, 255, 255, .09);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 0 .5rem;
	border-radius: .5rem;
	margin-bottom: .5rem;
}

.post-inner {
	width: 100%;
}

a {
	text-decoration: none;
}

h3, p {
	margin: .5rem 0;
}

.post-buttons {
	display: flex;
	flex-direction: row;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
}

.post-buttons > * {
	margin: 5px;
}
</style>