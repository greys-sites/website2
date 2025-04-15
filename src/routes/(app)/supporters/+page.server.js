import { fail } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var d;
	try {
		d = await fetch(`/api/supporters`)
		d = await d.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				d = null;
				break;
			default:
				d = null;
				break;
		}
	}

	d = d.sort((a, b) => a.name.localeCompare(b.name));
	return { supporters: d };
}