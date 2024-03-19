import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) {
		return { user: null }
	}

	var d;
	try {
		d = await axios.get(API + `/users/@me`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user');
				d = null;
				// throw redirect(308, '/admin/login');
				break;
			default:
				d = null;
				break;
		}
	}

	return { user: d };
}