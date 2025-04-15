import { fail } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var d;
	try {
		d = await fetch(`/api/users/@me`, {
			headers: {
				'Authorization': u
			}
		})
		d = await d.json();
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user');
				d = null;
				break;
			default:
				d = null;
				break;
		}
	}

	return { user: d };
}