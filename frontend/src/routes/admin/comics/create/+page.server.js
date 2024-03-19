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
		console.log(images)
		
		var resp = await axios.post(`${API}/comics`, {
			name,
			hid,
			tagline,
			thumbnail,
			story,
			description,
			images
		}, { headers: { 'Authorization': u } })

		return { success: true, hid: resp.data.hid}
	}
}