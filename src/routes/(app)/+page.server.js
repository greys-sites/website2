import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	try {
		var resp = await fetch(`/api/posts?pinned=true`);
		var posts = await resp.json();
		posts = posts?.filter(x => !x.draft);

		resp = await fetch(`/api/projects?featured=true`);
		var projects = await resp.json();
	} catch(e) {
		console.log(e)
		return error(500, {
			message: "Internal error"
		});
	}

	return {
		posts,
		projects
	}
}