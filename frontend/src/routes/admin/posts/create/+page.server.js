import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const actions = {
	create: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		console.log(u);
		console.log(data);
		var title = data.get('title');
		var hid = data.get('hid');
		var short = data.get('short');
		var body = data.get('body');
		console.log({
			title,
			hid,
			short,
			body
		})
		
		var resp = await axios.post(`${API}/posts`, {
			title,
			hid,
			short,
			body
		}, { headers: { 'Authorization': u } })

		console.log(resp.data);
		return { success: true, hid: resp.data.hid}
	}
}