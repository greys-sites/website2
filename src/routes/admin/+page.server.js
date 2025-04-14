import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	console.log(u)
	if(!u) {
		return { user: null }
	}

	var d;
	try {
		d = await fetch(`/api/users/@me`, {
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
			case 404:
				cookies.delete('user', { path: '/' });
				d = null;
				break;
			default:
				d = null;
				break;
		}
	}

	return { user: d };
}

export const actions = {
	login: async ({ cookies, request, fetch }) => {
		var d = await request.formData();
		var username = d.get('username');
		var password = d.get('password');

		try {
			var u = await fetch('/api/logins/verify', {
				body: JSON.stringify({
					username,
					password
				}),
				method: 'POST'
			});
			u = await u.json();

			if(u?.login) {
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