import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};
	
	var d;
	try {
		d = await fetch(`/api/flags`);
		d = await d.json();
		d = d.sort((a, b) => a.id - b.id);
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { flags: [] };
				break;
		}
	}

	return { flags: d, settings };
}