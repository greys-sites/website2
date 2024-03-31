import { error } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ }) {
	try {
		var resp = await axios.get(`${API}/posts/pinned`);
		var posts = resp.data;

		resp = await axios.get(`${API}/projects/featured`);
		var projects = resp.data;
	} catch(e) {
		console.log(e)
		return error(500, {
			message: "Internal error"
		});
	}

	return {
		posts,
		projects
	}
}