import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await fetch(`/api/tags`);
		var tags = await d.json();

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
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { posts: [] };
				break;
		}
	}

	return {
		posts,
		tags,
		settings,
		pinned
	};
}