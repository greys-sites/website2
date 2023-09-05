<script>
	export let data;
</script>

<img class="hero" src={data.post.cover_url ?? "https://cdn.greysdawn.com/81fa.png"}>
<h1>{data.post.title}</h1>
<div class="body">{@html data.post.body}</div>

<style>
	.hero {
		width: 90%;
		height: auto;
		margin-top: 50px;
		border-radius: 20px;
		max-width: 1200px;
	}

	h1 {
		font-size: 40px;
	}

	.body {
		font-size: 22px;
	}
</style>