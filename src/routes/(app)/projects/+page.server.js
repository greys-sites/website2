import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await fetch(`/api/projects`)
		d = await d.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { projects: [] };
				break;
		}
	}

	return { projects: d, settings };
}