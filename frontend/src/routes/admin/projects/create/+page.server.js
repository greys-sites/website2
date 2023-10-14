import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies }) => {
	var u = cookies.get('user');
	var d = await axios.get(API + '/tags', {
		headers: {
			'Authorization': u
		}
	})

	console.log(d.data);
	return { tags: d.data };
}

export const actions = {
	create: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		var name = data.get('name');
		var hid = data.get('hid');
		var short = data.get('short');
		var cover_url = data.get('cover_url');
		var category = data.get('category');
		var description = data.get('description');
		
		var resp = await axios.post(`${API}/projects`, {
			name,
			hid,
			short,
			cover_url,
			category,
			description,
		}, { headers: { 'Authorization': u } })

		return { success: true, hid: resp.data.hid}
	}
}