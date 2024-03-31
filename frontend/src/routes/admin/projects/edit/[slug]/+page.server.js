import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp;
	try {
		resp = await axios.get(`${API}/projects/${params.slug}`);
	} catch(e) {
		console.log(e)
	}

	return { proj: resp?.data ?? { } };
}

export const actions = {
	edit: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		console.log(u);
		console.log(data);
		var name = data.get('name');
		var hid = data.get('hid');
		var oldhid = data.get('oldhid');
		var short = data.get('short');
		var cover_url = data.get('cover_url');
		var category = data.get('category');
		var description = data.get('description');
		var featured = data.get('featured');
		
		var resp = await axios.patch(`${API}/projects/${oldhid}`, {
			name,
			hid,
			short,
			cover_url,
			category,
			description,
			featured
		}, { headers: { 'Authorization': u } })

		console.log(resp.data);
		return { success: true, hid: resp.data.hid}
	}
}