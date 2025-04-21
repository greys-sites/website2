import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	if(!u) {
		redirect(307, '/admin');
	}

	var d;
	try {
		d = await fetch(`/api/posts`);
		d = await d.json();
		var pinned = [];
		var drafts = [];
		var posts = [];

		for(var p of d) {
			if(p.draft) drafts.push(p);
			else if(p.pinned) pinned.push(p);
			else posts.push(p)
		}

		d = await fetch(`/api/tags`);
		var tags = await d.json();
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

	return { posts, pinned, drafts, tags };
}

export const actions = {
	create: async ({ cookies, request, fetch, locals }) => {
		var u = locals.user;
		var tk = cookies.get('user');
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };
		
		var tags = await fetch('/api/tags', {
			headers: {
				'Authorization': tk
			}
		});
		tags = await tags.json();
		if(!tags?.length) tags = [];

		var arr = Array.from(fd);
		for(var e of arr) {
			if(['tags'].includes(e[0])) continue;
			
			if(['pinned', 'draft'].includes(e[0])) obj[e[0]] = true;
			else obj[e[0]] = e[1];
		}

		var ptags = fd.getAll('tags')
			.map(x => x.toLowerCase().trim())
			.filter(x => x?.length);

		var toCreate = [];
		var tids = [];
		for(var t of ptags) {
			var ex = tags.find(x => x.name == t);
			if(ex && !tids.includes(ex.hid)) tids.push(ex.hid);
			else if(!ex && !toCreate.includes(t)) toCreate.push(t);
		}
		
		if(toCreate.length) {
			var tresp = await fetch(
				`/api/tags/bulk`,
				{
					body: JSON.stringify(toCreate.map(x => ({ name: x}))),
					headers: { 'Authorization': u },
					method: 'POST'
				}
			)
			var td = await tresp.json();
			tids = tids.concat(td.tags.map(x => x.hid));
		}

		obj.tags = tids;

		try {
			var resp = await fetch(`/api/posts`, {
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
		if(!u) return { success: false, status: 401 };

		var fd = await request.formData();
		var obj = { };
		
		var tags = await fetch('/api/tags', {
			headers: {
				'Authorization': tk
			}
		});
		tags = await tags.json();
		if(!tags?.length) tags = [];

		var arr = Array.from(fd);
		for(var e of arr) {
			if(['tags'].includes(e[0])) continue;

			if(['pinned', 'draft'].includes(e[0])) obj[e[0]] = true;
			else obj[e[0]] = e[1];
		}

		var ptags = fd.getAll('tags')
			.map(x => x.toLowerCase().trim())
			.filter(x => x?.length);

		var toCreate = [];
		var tids = [];
		for(var t of ptags) {
			var ex = tags.find(x => x.name == t);
			if(ex && !tids.includes(ex.hid)) tids.push(ex.hid);
			else if(!ex && !toCreate.includes(t)) toCreate.push(t);
		}
		
		if(toCreate.length) {
			var tresp = await fetch(
				`/api/tags/bulk`,
				{
					body: JSON.stringify(toCreate.map(x => ({ name: x}))),
					headers: { 'Authorization': u },
					method: 'POST'
				}
			)
			var td = await tresp.json();
			tids = tids.concat(td.tags.map(x => x.hid));
		}

		obj.tags = tids;
		console.log(obj)

		try {
			var resp = await fetch(`/api/posts/${obj.hid}`, {
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