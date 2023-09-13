import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp = await axios.get(`${API}/posts/${params.slug}`);

	return resp.data;
}

export const actions = {
	edit: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		console.log(u);
		console.log(data);
		var title = data.get('title');
		var hid = data.get('hid');
		var oldhid = data.get('oldhid');
		var short = data.get('short');
		var body = data.get('body');
		console.log({
			title,
			hid,
			short,
			body
		})
		
		var resp = await axios.patch(`${API}/posts/${oldhid}`, {
			title,
			hid,
			short,
			body
		}, { headers: { 'Authorization': u } })

		console.log(resp.data);
		return { success: true, hid: resp.data.hid}
	}
}