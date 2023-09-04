<script>
import { closeModal, closeAll } from '$lib/stores/modals';
import { fly } from 'svelte/transition';

export let props = {
	id: 0,
	type: "alert",
	title: "This is a modal :)",
	message: "This is some text inside a modal"
}

async function confirm() {
	if(props.onConfirm) await props.onConfirm(props);
	closeModal(props.id);
}

async function close() {
	closeModal(props.id)
}

async function cancel() {
	if(props.onCancel) await props.onCancel(props);
	closeModal(props.id)
}
</script>

<dialog on:click|stopPropagation class={"modal-" + props.type} transition:fly={{ y: 25, duration: 250 }}>
	<div class="modal-content">
		<h1>{props.title}</h1>
		<p>{props.message}
	</div>
	<div class="modal-buttons">
		{#if props.type == "alert"}
			<button id={`modal-${props.id}-close`} on:click|once|stopPropagation={() => close()}>Okay</button>
		{/if}
		{#if props.type == "confirm"}
			<button id={`modal-${props.id}-cancel`} on:click|once|stopPropagation={() => cancel()}>Cancel</button>
			<button id={`modal-${props.id}-confirm`} on:click|once|stopPropagation={() => confirm()}>Confirm</button>
		{/if}
	</div>
</dialog>

<style>
.modal-alert, .modal-confirm {
	background-color: #202020;
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	border-radius: 10px;
	border: none;
}

.modal-content {
	width: 100%;
}

.modal-buttons {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
}

.modal-buttons > * {
	margin: 10px;
}
</style>