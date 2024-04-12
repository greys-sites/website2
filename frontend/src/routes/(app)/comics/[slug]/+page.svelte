<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import { formatDate } from '$lib/utils';
	
	export let data;

	let descEl;
	function jump() {
		descEl.scrollIntoView({ behavior: 'smooth' })
	}
</script>

<svelte:head>
	<title>{data.comic.name} | The Grey Skies</title>
</svelte:head>

<img alt="Comic thumbnail" class="hero" src={data.comic.thumbnail ? data.comic.thumbnail : "https://cdn.greysdawn.com/img/81fa.png"}>
<div class="heading">
	<h1>{data.comic.name}</h1>
	<h2>{data.comic.tagline}</h2>
</div>
<button on:click={jump}>jump to description</button>
<div class="gallery">
	{#each data.comic.images as img}
		<div class="img-container">
			<img alt={img.name} src={img.url} />
		</div>
	{/each}
</div>
<h1 bind:this={descEl}>Description</h1>
<div class="body">{@html insane(marked.parse(data.comic.description ?? '*Nothing to see here*'))}</div>

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
		max-width: 700px;
		height: auto;
	}

	.gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.img-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 10px;
	}

	@media(min-width: 700px) {
		.gallery {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>