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
		d = await fetch(`/api/projects`, {
			headers: {
				'Authorization': u
			}
		})
		d = await d.json();
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				cookies.delete('user', { path: '/' });
				redirect(307, '/admin');
				break;
			default:
				d = { projects: [] };
				break;
		}
	}

	return { projects: d, settings };
}

export const actions = {
	create: async ({ cookies, request, fetch, locals }) => {
		var u = locals.user;
		var tk = cookies.get('user');
		console.log(u);
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };

		var arr = Array.from(fd);
		for(var e of arr) {
			if(e[0] == 'featured') obj[e[0]] = true;
			else obj[e[0]] = e[1];
		}

		try {
			var resp = await fetch(`/api/projects`, {
				headers: {
					'Authorization': tk
				},
				body: JSON.stringify(obj),
				method: 'POST'
			})
			resp = await resp.json();

			if(!resp?.message) {
				return {
					success: true,
					type: 'created'
				}
			};
		} catch(e) {
			console.log(e);
			return {
				success: false
			}
		}
	},
	edit: async ({ cookies, request, fetch, locals }) => {
		var u = locals.user;
		var tk = cookies.get('user');
		console.log(u);
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };

		var arr = Array.from(fd);
		for(var e of arr) {
			if(e[0] == 'featured') obj[e[0]] = true;
			else obj[e[0]] = e[1];
		}

		try {
			var resp = await fetch(`/api/projects/${obj.hid}`, {
				headers: {
					'Authorization': tk
				},
				body: JSON.stringify(obj),
				method: 'PATCH'
			})
			resp = await resp.json();

			if(!resp?.message) {
				return {
					success: true,
					type: 'edited'
				}
			};
		} catch(e) {
			console.log(e);
			return {
				success: false
			}
		}
	}
}