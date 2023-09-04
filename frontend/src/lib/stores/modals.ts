import { writable } from 'svelte/store';

export const modals = writable([]);

export const closeModal = (id) => {
	modals.update(ms => {
		console.log(ms);
		return ms.filter(m => m.id != id)
	});
}

export const addModal = (data = {
	canClose: true,
	title: "This is a modal :)",
	message: "Here is some text inside the modal",
	type: "alert"
}) => {
	const id = Math.floor(Math.random() * 1000);

	modals.update((ms) => {
		console.log(ms);
		return [...ms, { id, ...data }];
	})
}

export const closeAll = () => {
	modals.update(() => [])
}