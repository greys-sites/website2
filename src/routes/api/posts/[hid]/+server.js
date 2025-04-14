import { error, json } from '@sveltejs/kit';
import Posts from '$lib/data/posts.js';
import { handleWebhook } from '$lib/utils.server.js';

export async function GET({ request, params, cookies }) {
	var post = await Posts.get(params.hid);
	if(!post?.id) return error(404);
	await post.getUser();
	await post.getTags();
	return json(post);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var post = await Posts.get(hid);
	if(!post?.id) return error(404);
	var d = !!post.draft;
	
	for(var k in data) {
		post[k] = data[k];
	}

	await post.save();
	if(d && !post.draft) // post was made public
		await handleWebhook(post, 'post');

	return json(post);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var post = await Posts.get(hid);
	if(!post?.id) return error(404);

	await post.delete();
	return json();
}