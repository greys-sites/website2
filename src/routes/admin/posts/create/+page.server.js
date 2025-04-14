import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, fetch }) => {
	var u = cookies.get('user');
	var d = await fetch('/api/tags', {
		headers: {
			'Authorization': u
		}
	})
	var tags = await d.json();

	return { tags };
}

export const actions = {
	create: async ({ cookies, request, fetch }) => {
		var data = await request.formData();
		var u = cookies.get('user');

		var tags = await fetch('/api/tags', {
			headers: {
				'Authorization': u
			}
		});
		tags = await tags.json();
		if(!tags?.length) tags = [];
		
		var title = data.get('title');
		var hid = data.get('hid');
		var short = data.get('short');
		var cover_url = data.get('cover_url');
		var body = data.get('body');
		var pinned = data.get('pinned');
		var draft = data.get('draft');
		var ptags = data.getAll("tags");
		ptags.map(x => x.toLowerCase().trim())
			.filter(x => x?.length);

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
					headers: { 'Authorization': u },
					body: toCreate.map(x => ({ name: x})),
					method: 'POST'
				}
			)
			var td = await tresp.json();
			td = td.tags;
			tids = tids.concat(td.map(x => x.hid));
		}
		
		var resp = await fetch(`/api/posts`, {
			headers: { 'Authorization': u },
			body: JSON.stringify({
				title,
				hid,
				short,
				cover_url,
				body,
				tags: tids,
				pinned,
				draft,
			}),
			method: 'POST'
		})
		resp = await resp.json();

		return { success: true, hid: resp.hid}
	}
}