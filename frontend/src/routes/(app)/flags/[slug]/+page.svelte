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

<img class="hero" src={data.flag.thumbnail ? data.flag.thumbnail : "https://cdn.greysdawn.com/img/81fa.png"}>
<div class="heading">
	<h1>{data.flag.name}</h1>
</div>
<button on:click={jump}>jump to description</button>
<div class="gallery">
	{#each data.flag.images as img}
		<div class="img-container">
			<h3>{img.name}</h3>
			<img src={img.url} />
		</div>
	{/each}
</div>
<h1 bind:this={descEl}>Description</h1>
<div class="body">{@html insane(marked.parse(data.flag.description ?? '*Nothing to see here*'))}</div>

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

	.flag-meta {
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

	.flag-tag {
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

	.img-container h3 {
		text-transform: uppercase;
		transform: scale(1.3);
	}

	@media(min-width: 700px) {
		.body {
			font-size: 22px;
		}

		.gallery {
			flex-direction: row;
		}
	}
</style>