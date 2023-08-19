import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ }) {
	var d;
	try {
		d = await axios.get(API + '/posts');
		d = d.data;
	} catch(e) {
		return res.status(e.response?.status ?? 500).send(
			e.response?.body ?? "Internal error"
		);
	}

	return { posts: d };
}