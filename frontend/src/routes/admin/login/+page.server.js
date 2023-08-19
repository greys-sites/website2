import { fail, redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import axios from 'axios';
import { API } from '$env/static/private';

console.log(API);

export function load({ cookies }) {
	var u = cookies.get('user');
	if(u) throw redirect(308, '/dash');
}

export const actions = {
	login: async ({ cookies, request }) => {
		console.log(request)
		var d = await request.formData();
		console.log(d);
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
				cookies.set('user', u.login.token);
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