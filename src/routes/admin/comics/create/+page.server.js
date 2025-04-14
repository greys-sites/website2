import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, fetch }) => {
	var u = cookies.get('user');
	var d = await fetch('/api/tags', {
		headers: {
			'Authorization': u
		}
	})
	var tags = await d.json();

	return { tags };
}

export const actions = {
	create: async ({ cookies, request, fetch }) => {
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
		
		var resp = await fetch(`/api/comics`, {
			headers: { 'Authorization': u },
			body: JSON.stringify({
				name,
				hid,
				tagline,
				thumbnail,
				story,
				description,
				images
			}),
			method: 'POST'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}