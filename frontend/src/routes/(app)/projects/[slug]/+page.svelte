<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import { formatDate } from '$lib/utils';
	
	export let data;
</script>

<img class="hero" src={data.project.cover_url ? data.project.cover_url : "https://cdn.greysdawn.com/81fa.png"}>
<div class="heading">
	<h1>{data.project.name}</h1>
	<h3>{data.project.short}</h3>
</div>
<div class="body">{@html insane(marked.parse(data.project.description ?? '*Nothing to see here*'))}</div>

<style>
	.hero {
		width: 90%;
		height: auto;
		margin-top: 50px;
		border-radius: 20px;
		max-width: 1200px;
	}

	.heading {
		width: 90%;
		max-width: 1200px;
	}

	.project-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.avatar {
		width: 32px;
		height: 32px;
		background-position: center;
		background-size: cover;
		border-radius: 50%;
	}

	h1 {
		/*text-align: center;*/
		font-size: 40px;
		margin: .5rem 0;
	}

	h3 {
		/*opacity: 80%;*/
		font-weight: normal;
		margin: 0;
		z-index: 0;
	}

	.project-tag {
		padding: 5px;
		background-color: rgba(255, 255, 255, .09);
		border-radius: 5px;
		margin: 0 5px;
	}

	.body {
		margin-top: 1em;
		font-size: 16px;
		width: 90%;
		max-width: 1200px;
	}

	img {
		max-width: 90%;
		height: auto;
	}

	@media(min-width: 700px) {
		.body {
			font-size: 22px;
		}
	}
</style>