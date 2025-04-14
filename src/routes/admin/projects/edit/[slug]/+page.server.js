import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params, fetch }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp;
	try {
		resp = await fetch(`/api/projects/${params.slug}`);
		resp = await resp.json();
	} catch(e) {
		console.log(e)
	}

	return { proj: resp ?? { } };
}

export const actions = {
	edit: async ({ cookies, request, fetch }) => {
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
		
		var resp = await fetch(`/api/projects/${oldhid}`, {
			headers: { 'Authorization': u },
			body: JSON.stringify({
				name,
				hid,
				short,
				cover_url,
				category,
				description,
				featured
			}),
			method: 'PATCH'
		})
		resp = await resp.json();

		console.log(resp.data);
		return { success: true, hid: resp.hid}
	}
}