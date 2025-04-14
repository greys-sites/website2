<script>
	export let value = false;
	export let name = "value";
	export let label = "Some Value";
	export let ontoggle = () => { }

	function toggle() {
		value = !value;
		if(ontoggle) ontoggle(value);
	}
</script>

<div class="toggle-wrapper">
	<p>{label}</p>
	<div role="button" tabindex=-1 class="toggle" class:toggled={value} on:click={toggle} on:keydown={toggle}>
		<div class="toggle-button"></div>
	</div>
	<input type="hidden" bind:value={value} name={name} />
</div>

<style>
	.toggle-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 500px;
		justify-content: space-between;
		cursor: pointer;
	}

	.toggle {
		background: #111111;
		width: 40px;
		height: 20px;
		display: inline-block;
		margin-left: 20px;
		border-radius: 20px;
	}

	.toggle-button {
		background: #333;
		width: 20px;
		height: 20px;
		position: relative;
		left: 0;
		border-radius: 20px;
		transition: all .25s;
	}

	.toggled .toggle-button {
		background: #ccc;
		left: 20px;
	}
</style>