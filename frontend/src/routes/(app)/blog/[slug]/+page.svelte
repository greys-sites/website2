<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import twemoji from 'twemoji';
	import { formatDate } from '$lib/utils';
	
	export let data;
</script>

<svelte:head>
	<title>{data.post.title} | The Grey Skies</title>
	<meta name="description" content={data.post.short}>

	<meta property="og:url" content={"https://greysdawn.com/blog/"+data.post.slug}>
	<meta property="og:type" content="website">
	<meta property="og:title" content={data.post.title + " | The Grey Skies"}>
	<meta property="og:description" content={data.post.short}>
	<meta property="og:image" content={data.post.cover_url ?? "https://cdn.greysdawn.com/img/81fa.png"}>

	<meta name="twitter:card" content="summary_large_image">
	<meta property="twitter:domain" content="greysdawn.com">
	<meta property="twitter:url" content={"https://greysdawn.com/blog/"+data.post.slug}>
	<meta name="twitter:title" content={data.post.title + " | The Grey Skies"}>
	<meta name="twitter:description" content={data.post.short}>
	<meta name="twitter:image" content={data.post.cover_url ?? "https://cdn.greysdawn.com/img/81fa.png"}>
</svelte:head>

<img alt="Post thumbnail" class="hero" src={data.post.cover_url ? data.post.cover_url : "https://cdn.greysdawn.com/img/81fa.png"}>
<div class="heading">
	<h1>{data.post.title}</h1>
	<h3>{data.post.short}</h3>
	<div class="post-meta">
		<p>{formatDate(data.post.post_timestamp)} |</p>
		{#each data.post.full_tags as t (t.hid)}
			<div class="post-tag">{t.name}</div>
		{/each}
	</div>
</div>
<div class="body">{@html (
	twemoji.parse(
		insane(
			marked.parse(
				data.post.body
			)
		), {
			base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
		}
	)
)}</div>

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

	.post-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.post-meta p {
		margin-right: 5px;
		width: auto;
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

	.post-tag {
		padding: 5px;
		background-color: rgba(255, 255, 255, .09);
		border-radius: 5px;
		margin-right: 5px;
	}

	.body {
		margin-top: 1em;
		width: 90%;
		max-width: 700px;
	}
</style>