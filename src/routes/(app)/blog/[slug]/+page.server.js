import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params }) => {
	var resp = await axios.get(`${API}/posts/${params.slug}`);

	return {
		post: resp.data
	}
}