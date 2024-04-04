<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import { formatDate } from '$lib/utils';
	
	export let data;
</script>

<img alt="Project thumbnail" class="hero" src={data.project.cover_url ? data.project.cover_url : "https://cdn.greysdawn.com/img/81fa.png"}>
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
		max-width: 700px;
	}

	.heading {
		width: 90%;
		max-width: 700px;
	}

	h1 {
		/*text-align: center;*/
		font-size: 40px;
		margin: .5rem 0;
	}

	.body {
		margin-top: 1em;
		width: 90%;
		max-width: 700px;
	}

	img {
		max-width: 90%;
		height: auto;
	}
</style>