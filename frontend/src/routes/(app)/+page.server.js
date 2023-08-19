import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ }) {
	var d;
	try {
		d = await axios.get(API + '/posts');
		d = d.data;
	} catch(e) {
		return fail(
			e.response?.status ?? 500,
			{ error: e.response?.body ?? "Internal error" }
		);
	}

	return { posts: d };
}