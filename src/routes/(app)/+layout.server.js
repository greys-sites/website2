import { fail } from '@sveltejs/kit';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');

	var d, user, posts, projects;
	try {
		if(u) {
			d = await fetch(`/api/users/@me`, {
				headers: {
					'Authorization': u
				}
			})
			user = await d.json();
		}

		d = await fetch(`/api/posts?pinned=true`);
		posts = await d.json();

		d = await fetch(`/api/projects?featured=true`);
		projects = await d.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
			case 404:
				cookies.delete('user');
				d = null;
				break;
			default:
				d = null;
				break;
		}
	}

	return { user, posts, projects };
}