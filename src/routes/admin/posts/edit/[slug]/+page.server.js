import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params, fetch }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp = await fetch(`/api/posts/${params.slug}`);
	var d = await fetch('/api/tags', {
		headers: {
			'Authorization': u
		}
	})
	var post = await resp.json();
	var tags = await d.json();

	return { post, tags };
}

export const actions = {
	edit: async ({ cookies, request, fetch }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		console.log(u);
		console.log(data);

		var tags = await fetch('/api/tags', {
			headers: {
				'Authorization': u
			}
		});
		tags = await tags.json();
		if(!tags?.length) tags = [];

		var title = data.get('title');
		var hid = data.get('hid');
		var oldhid = data.get('oldhid');
		var short = data.get('short');
		var cover_url = data.get('cover_url');
		var body = data.get('body');
		var ptags = data.getAll("tags");
		ptags.map(x => x.toLowerCase().trim())
			.filter(x => x?.length);
		var pinned = data.get('pinned');
		var draft = data.get('draft');

		var toCreate = [];
		var tids = [];
		for(var t of ptags) {
			var e = tags.find(x => x.name == t);
			if(e && !tids.includes(e.hid)) tids.push(e.hid);
			else if(!e && !toCreate.includes(t)) toCreate.push(t);
		}
		
		if(toCreate.length) {
			var tresp = await fetch(
				`/api/tags/bulk`,
				{
					method: 'POST',
					headers: { 'Authorization': u },
					body: toCreate.map(x => ({ name: x})),
				}
			)
			var td = await tresp.json()
			td = td.tags;
			tids = tids.concat(td.map(x => x.hid));
		}
		
		var resp = await fetch(`/api/posts/${oldhid}`, {
			headers: { 'Authorization': u },
			body: {
				title,
				hid,
				short,
				cover_url,
				body,
				tags: tids,
				pinned,
				draft
			},
			method: 'PATCH'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}