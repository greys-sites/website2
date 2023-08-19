<script>
export let data;
</script>

<h1>tests</h1>
{#each data.posts as d}
	<div style="background-color: #ddd">
		<h3>{d.title}</h3>
		<p>{d.body}</p>
	</div>
{/each}