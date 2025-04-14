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
		var short = data.get('short');
		var cover_url = data.get('cover_url');
		var category = data.get('category');
		var description = data.get('description');
		var featured = data.get('featured');
		
		var resp = await fetch(`/api/projects`, {
			headers: { 'Authorization': u },
			body: {
				name,
				hid,
				short,
				cover_url,
				category,
				description,
				featured,
			},
			method: 'POST'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}