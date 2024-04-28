import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

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
		d = await axios.get(API + `/supporters`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				/* @migration task: add path argument */ cookies.delete('user');
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
	edit: async ({ cookies, request }) => {
		var u = cookies.get('user')
		var d = await request.formData();
		var name = d.get("name");
		var link = d.get("link");
		var hid = d.get("hid");

		try {
			var res = await axios.patch(`${API}/supporters/${hid}`, {
				name,
				link
			}, {
				headers: {
					'Authorization': u
				}
			});
		} catch(e) {
			console.log(e);
			return fail(400, {
				success: false,
				status: 400,
				message: "Internal error"
			});
		}

		return { success: true, data: d };
	},

	create: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		var name = data.get('name');
		var link = data.get('link');
		
		var resp = await axios.post(`${API}/supporters`, {
			name,
			link
		}, { headers: { 'Authorization': u } })

		return { success: true, hid: resp.data.hid}
	}
}