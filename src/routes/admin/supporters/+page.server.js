import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	if(!u) {
		redirect(307, '/admin');
	}

	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await fetch(`/api/supporters`, {
			headers: {
				'Authorization': u
			}
		})
		d = await d.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				cookies.delete('user', { path: '/' });
				redirect(307, '/admin');
				break;
			default:
				d = { posts: [] };
				break;
		}
	}

	d = d.sort((a, b) => a.name.localeCompare(b.name));
	return { supporters: d, settings };
}

export const actions = {
	edit: async ({ cookies, request, fetch }) => {
		var u = cookies.get('user')
		var d = await request.formData();
		var name = d.get("name");
		var link = d.get("link");
		var hid = d.get("hid");

		try {
			var res = await fetch(`/api/supporters/${hid}`, {
				headers: {
					'Authorization': u
				},
				body: {
					name,
					link
				},
				method: 'PATCH'
			});
		} catch(e) {
			console.log(e);
			return fail(400, {
				success: false,
				status: 400,
				message: "Internal error"
			});
		}
		res = await res.json()

		return { success: true, data: res };
	},

	create: async ({ cookies, request, fetch }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		var name = data.get('name');
		var link = data.get('link');
		
		var resp = await fetch(`/api/supporters`, {
			headers: { 'Authorization': u },
			body: {
				name,
				link
			},
			method: 'POST'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}