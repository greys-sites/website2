<script>
	import { addModal, closeAll } from '$lib/stores/modals';
	import { add as addToast } from '$lib/stores/toasts';

	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	
	export let data;
	export let form;

	let loading;
	let error;
	async function deletePost(hid) {
		loading = true;
		try {
			await fetch('/admin/posts/delete', {
				method: "POST",
				body: JSON.stringify({ hid })
			})
		} catch(e) {
			console.log(e);
			closeAll()
			addToast({
				type: 'error',
				message: e,
				canClose: true,
				timeout: 5000
			});
			return;
		}

		invalidateAll()
		closeAll()
		addToast({
			type: 'success',
			message: 'Post deleted!',
			canClose: true,
			timeout: 5000
		})
	}
</script>

<h1>Posts</h1>

<button>test</button>

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