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

<div
	class={"toast " + props.type}
	transition:fly|global={{ y: 50, duration: 500 }}
	on:click={() => {
		if(props.canClose) {
			dismiss(props.id)
		}
	}}

	on:keypress={() => {
		if(props.canClose) {
			dismiss(props.id)
		}
	}}
>
	<p>{props.message}</p>
	<div class="progress" style={`
		width: ${w};
		transition: width ${props.timeout / 1000}s linear;
	`}>
	</div>
</div>

<style>
	.toast {
		color: #fff;
		border-radius: 0.5rem;
		text-align: center;
		margin: auto;
		margin-top: 10px;
		/*width: 100%;*/
		padding: 0;
		/*display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;*/
		position: relative;
		z-index: 250;
		overflow: hidden;
		cursor: pointer;
		/*min-height: 2rem;*/
	}

	.toast p {
		color: #fff;
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
		padding: 1rem;
	}

	.success {
		background-color: #55aa55;
	}

	.error {
		background-color: #aa5555;
	}

	.info {
		background-color: #5555aa;
	}
</style>