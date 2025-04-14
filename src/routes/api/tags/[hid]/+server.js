import { error, json } from '@sveltejs/kit';
import Tags from '$lib/data/tags.js';

export async function GET({ request, params, url }) {
	var tag = await Tags.get(params.hid);
	if(!tag?.id) return error(404);
	
	var q = url.searchParams.get('posts');
	if(q) for(var t of tags) await t.getPosts();

	return json(tag);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var tag = await Tags.get(hid);
	if(!tag?.id) return error(404);
	
	for(var k in data) {
		tag[k] = data[k];
	}
	await tag.save();
	return json(tag);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var tag = await Tags.get(hid);
	if(!tag?.id) return error(404);

	await tag.delete();
	return json();
}