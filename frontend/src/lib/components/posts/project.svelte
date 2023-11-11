<script>
	import { addModal, closeAll } from '$lib/stores/modals';
	import { formatDate } from '$lib/utils';

	export let project;

	export let deleteProject;
</script>

<div class="proj-item">
	<img class="proj-cover" src={ project.cover_url?.length ? project.cover_url : "https://cdn.greysdawn.com/81fa.png" } />
	<div class="proj-inner">
		<h1><a href={`/projects/${project.hid}`}>{project.name}</a></h1>
		<p>{project.short}</p>
	</div>
	{#if deleteProject}
	<div class="proj-buttons">
		<a class="link-button" href={`/admin/projects/edit/${project.hid}`}>edit</a>
		<button on:click={() => addModal({
			title: "Delete project",
			message: "Do you want to delete this project?",
			type: "confirm",
			onConfirm: () => {
				addModal({
					title: "Are you sure?",
					message: "This action can't be undone.",
					type: "confirm",
					onConfirm: () => deleteProject(project.hid)
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
}

.proj-tag {
	padding: 5px;
	background-color: rgba(255, 255, 255, .09);
	border-radius: 5px;
	margin: 0 5px;
}

.proj-meta {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

.avatar {
	width: 32px;
	height: 32px;
	background-position: center;
	background-size: cover;
	border-radius: 50%;
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