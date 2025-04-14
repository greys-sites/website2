import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params, fetch }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp;
	try {
		resp = await fetch(`/api/flags/${params.slug}`);
		resp = await resp.json();
	} catch(e) {
		console.log(e)
	}

	return { flag: resp ?? { } };
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
		var thumbnail = data.get('thumbnail');
		var category = data.get('category');
		var description = data.get('description');
		var imgn = data.getAll('img-name');
		var imgu = data.getAll('img-url');
		var images = imgn.map((x, i) => {
			return {
				name: x,
				url: imgu[i]
			}
		})
		
		var resp = await fetch(`/api/flags/${oldhid}`, {
			headers: { 'Authorization': u },
			body: {
				name,
				hid,
				thumbnail,
				category,
				description,
				images
			},
			method: 'PATCH'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}