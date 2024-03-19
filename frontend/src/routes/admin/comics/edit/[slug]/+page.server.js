import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp;
	try {
		resp = await axios.get(`${API}/comics/${params.slug}`);
	} catch(e) {
		console.log(e)
	}

	return { com: resp?.data ?? { } };
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
		var tagline = data.get('tagline');
		var thumbnail = data.get('thumbnail');
		var story = data.get('story');
		var description = data.get('description');
		var imgn = data.getAll('img-name');
		var imgu = data.getAll('img-url');
		var images = imgn.map((x, i) => {
			return {
				name: x,
				url: imgu[i]
			}
		})
		
		var resp = await axios.patch(`${API}/comics/${oldhid}`, {
			name,
			hid,
			tagline,
			thumbnail,
			story,
			description,
			images
		}, { headers: { 'Authorization': u } })

		console.log(resp.data);
		return { success: true, hid: resp.data.hid}
	}
}