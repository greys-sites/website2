<script>
	import { addModal, closeAll } from '$lib/stores/modals';

	export let post;
	export let deletePost;
</script>

<div class="post-item">
	<img class="post-cover" src={ post.cover_url ?? "https://cdn.greysdawn.com/81fa.png" } />
	<div class="post-inner">
		<h1><a href={`/blog/${post.hid}`}>{post.title}</a></h1>
		<p>{post.short}</p>
	</div>
	{#if deletePost}
	<div class="post-buttons">
		<a class="link-button" href={`/admin/posts/edit/${post.hid}`}>edit</a>
		<button on:click={() => addModal({
			title: "Delete Post",
			message: "Do you want to delete this post?",
			type: "confirm",
			onConfirm: () => {
				addModal({
					title: "Are you sure?",
					message: "This action can't be undone.",
					type: "confirm",
					onConfirm: () => deletePost(post.hid)
				})
			}
		})}>delete</button>
	</div>
	{/if}
</div>

<style>
.post-item {
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

.post-cover {
	width: 100%;
	max-width: 700px;
	height: auto;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	margin-top: 10px;
	border-radius: 10px;
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
	font-size: 16px;
	cursor: pointer;
}
</style>