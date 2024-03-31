import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params }) => {
	var u = cookies.get('user');
	if(!u) return redirect(307, '/admin');

	var resp = await axios.get(`${API}/posts/${params.slug}`);
	var d = await axios.get(API + '/tags', {
		headers: {
			'Authorization': u
		}
	})

	console.log(resp.data, d.data);

	return { post: resp.data, tags: d.data };
}

export const actions = {
	edit: async ({ cookies, request }) => {
		var data = await request.formData();
		var u = cookies.get('user');
		console.log(u);
		console.log(data);

		var tags = await axios.get(API + '/tags', {
			headers: {
				'Authorization': u
			}
		});
		tags = tags.data;
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
		console.log('pinned: ',pinned)

		var toCreate = [];
		var tids = [];
		for(var t of ptags) {
			var e = tags.find(x => x.name == t);
			if(e && !tids.includes(e.hid)) tids.push(e.hid);
			else if(!e && !toCreate.includes(t)) toCreate.push(t);
		}
		
		if(toCreate.length) {
			var tresp = await axios.post(
				`${API}/tags/bulk`,
				toCreate.map(x => ({ name: x})),
				{ headers: { 'Authorization': u } }
			)
			var td = tresp.data.tags;
			tids = tids.concat(td.map(x => x.hid));
		}
		
		var resp = await axios.patch(`${API}/posts/${oldhid}`, {
			title,
			hid,
			short,
			cover_url,
			body,
			tags: tids,
			pinned: !!pinned
		}, { headers: { 'Authorization': u } })

		return { success: true, hid: resp.data.hid}
	}
}