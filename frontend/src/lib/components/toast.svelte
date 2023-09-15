<script>
import { dismiss } from '$lib/stores/toasts';
import { fly } from 'svelte/transition';

export let props = {
	id: 0,
	type: "success",
	canClose: true,
	timeout: 5000,
	message: "This is a toast :)"
}

let w = '0';

$: setTimeout(() => w = '100%')
</script>

<div class={"toast " + props.type} transition:fly={{ x: 50, duration: 500 }}>
{#if props.canClose}<button class="close" on:click={() => dismiss(props.id)}>
	<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
</button>{/if}
<p>{props.message}</p>
<div class="progress" style={`
	width: ${w};
	transition: width ${props.timeout / 1000}s linear;
`}>
</div>
</div>

<style>
	.toast {
		color: #eee;
		border-radius: 0.5rem;
		text-align: left;
		margin: auto;
		margin-top: 10px;
		width: 100%;
		padding: 0;
		/*display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;*/
		position: relative;
		z-index: 250;
		overflow: hidden;
		/*min-height: 2rem;*/
	}

	.progress {
		height: 10px;
		width: 0;
		background-color: rgba(255, 255, 255, .1);
		margin: 0;
		position: absolute;
		bottom: 0;
		/*border-bottom-right-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;*/
	}

	.close-container {
		width: 100%;
	}

	.close {
		font-weight: bold;
		font-size: 16px;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
		float: right;
		width: auto;
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
	}

	div > p {
		margin: 0;
		/*margin-bottom: 10px;*/
		padding: 0.5rem;
	}

	.success {
		background-color: #55aa55;
	}

	.error {
		background-color: #aa5555;
	}
</style>