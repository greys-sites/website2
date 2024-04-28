import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var d;
	try {
		d = await axios.get(API + `/supporters`)
		d = d.data;
		console.log(d)
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