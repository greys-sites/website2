import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) throw redirect(308, '/admin/login');

	var d;
	try {
		d = await axios.get(API + `/posts`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				cookies.delete('user');
				throw redirect(308, '/admin/login');
				break;
			default:
				d = { posts: [] };
				break;
		}
	}

	return { posts: d };
}