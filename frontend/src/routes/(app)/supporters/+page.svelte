<script>
	import { marked } from 'marked';
	import insane from 'insane';
	import twemoji from 'twemoji';

	export let data;
</script>

<h1>Supporters</h1>

<p>
 Our supporters have stuck with us through thick and thin,
 helping make our dreams of working on our projects full-time come true.
 We appreciate everything they do for us, and this page is for us to show that appreciation {@html twemoji.parse('💜')}
</p>

<p style="text-align: center">Here's a list of our current supporters:</p>

{#if data?.supporters?.length}
	{#each data.supporters as supp (supp.hid)}
		<p style="text-align: center">
			<b>
				{#if supp.link}
					<a href={supp.link}>
						{@html (
							twemoji.parse(
								insane(
									marked.parse(
										supp.name
									)
								), {
									base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
								}
							)
						)}
					</a>
				{:else}
					{@html (
						twemoji.parse(
							insane(
								marked.parse(
									supp.name
								)
							), {
								base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
							}
						)
					)}
				{/if}
			</b>
		</p>
	{/each}
{/if}

<style>
	.hero {
		width: 90%;
		height: auto;
		margin-top: 50px;
		border-radius: 20px;
		max-width: 700px;
	}

	p {
		font-size: 1.2rem;
		width: 90%;
		max-width: 700px;
	}

	h1, h2, h3 {
		text-align: center;
	}

	h1 {
		font-size: 40px;
		max-width: 700px;
		width: 90%;
	}

	h2, h3 {
		width: 90%;
		max-width: 700px;
	}
</style>