import { error } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ }) {
	try {
		var resp = await axios.get(`${API}/posts/recent`);
	} catch(e) {
		return fail(500, {
			message: "Internal error"
		});
	}

	return {
		posts: resp.data
	}
}