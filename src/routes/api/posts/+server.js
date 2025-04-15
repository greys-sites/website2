import { error, json } from '@sveltejs/kit';
import Posts from '$lib/data/posts.js';
import { handleWebhook } from '$lib/utils.server.js';

export async function GET({ request, url, cookies }) {
	let posts;
	let pinned = !!url.searchParams.get('pinned');
	let recent = !!url.searchParams.get('recent');
	console.log(pinned, recent);

	switch(true) {
		case pinned:
			posts = await Posts.getPinned();
			break;
		case recent:
			posts = await Posts.getRecent();
			break;
		default:
			posts = await Posts.getAll();
			break;
	}

	for(var p of posts) {
		await p.getUser();
		await p.getTags();
	}
	return json(posts);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);
	if(!data.hid) data.hid = data.title.replace(' ', '-').slice(0, 10).toLowerCase();

	var post = await Posts.create(data);
	if(!post.draft) await handleWebhook(post, 'post');
	return json(post);
}