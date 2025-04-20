import { fail, redirect, json } from '@sveltejs/kit';

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
		d = await fetch(`/api/comics`, {
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

	d = d.sort((a, b) => a.id - b.id);
	var categories = {};
	for(let c of d) {
		if(!categories[c.story]) {
			categories[c.story] = {
				name: c.story,
				comics: [c]
			};
		} else if(!categories[c.story].comics.find(x => x.hid == c.hid)) {
			categories[c.story].comics.push(c)
		}
	}
	console.log("server", categories)
	return { categories, comics: d, settings };
}

export const actions = {
	create: async ({ cookies, request, fetch, locals }) => {
		var u = locals.user;
		var tk = cookies.get('user');
		console.log(u);
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };
		var imgn = fd.getAll('img-name');
		var imgu = fd.getAll('img-url');

		obj.images = imgn.map((x, i) => {
			return {
				name: x,
				url: imgu[i]
			}
		})

		var arr = Array.from(fd);
		for(var e of arr) {
			if(['img-name', 'img-url'].includes(e[0])) continue;

			obj[e[0]] = e[1];
		}

		try {
			var resp = await fetch(`/api/comics`, {
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
	create: async ({ cookies, request, fetch, locals }) => {
		var u = locals.user;
		var tk = cookies.get('user');
		console.log(u);
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };
		var imgn = fd.getAll('img-name');
		var imgu = fd.getAll('img-url');

		obj.images = imgn.map((x, i) => {
			return {
				name: x,
				url: imgu[i]
			}
		})

		var arr = Array.from(fd);
		for(var e of arr) {
			if(['img-name', 'img-url'].includes(e[0])) continue;

			obj[e[0]] = e[1];
		}

		try {
			var resp = await fetch(`/api/comics/${obj.hid}`, {
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
	},
}