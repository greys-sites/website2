import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	console.log(u)
	if(!u) {
		return { user: null }
	}

	var d;
	try {
		d = await axios.get(API + `/users/@me`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user', { path: '/' });
				d = null;
				// throw redirect(308, '/admin/login');
				break;
			default:
				d = null;
				break;
		}
	}

	return { user: d };
}

export const actions = {
	login: async ({ cookies, request }) => {
		var d = await request.formData();
		var username = d.get('username');
		var password = d.get('password');

		try {
			var u = await axios.post(API + '/logins/verify', {
				username,
				password
			});

			if(u) {
				u = u.data;
				console.log(u);
				cookies.set('user', u.login.token, { path: '/' });
			} else return fail(401, {
				success: false,
				status: 401,
				message: "Login information is incorrect."
			});
		} catch(e) {
			console.log(e);
			return fail(401, {
				success: false,
				status: 401,
				message: "Login information is incorrect."
			});
		}
	}
}