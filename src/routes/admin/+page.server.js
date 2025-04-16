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
		if(d?.message) d = null;
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
			console.log(u);

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
	},
	del: async ({ cookies, request, fetch }) => {
		var u = cookies.get('user');
		var fd = await request.formData();
		var hid = fd.get('hid');
		var item = fd.get('type');

		try {
			var resp = await fetch(`/api/${item}/${hid}`, {
				headers: {
					'Authorization': u
				},
				method: 'DELETE'
			})

			if(resp) {
				return json({
					success: true
				}, { status: 200 })
			};
		} catch(e) {
			console.log(e);
			return json({
				success: false
			}, {
				status: e.response?.status ?? 400,
				message: e.response?.statusText ?? "Something went wrong."
			});
		}
	}
}