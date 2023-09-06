import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var d;
	try {
		d = await axios.get(API + `/posts`)
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { posts: [] };
				break;
		}
	}

	return { posts: d };
}