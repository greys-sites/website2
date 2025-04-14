import { error, json } from '@sveltejs/kit';
import Tags from '$lib/data/tags.js';

export async function GET({ request, cookies, url }) {
	var tags = await Tags.getAll();
	var q = url.searchParams.get('posts');
	if(q) for(var t of tags) await t.getPosts();

	return json(tags);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var { name, description } = data;
	name = name?.toLowerCase().trim();
	if(!name?.length) return error(400, 'Tag names must not be empty.');
	description = description?.trim() ?? "";

	var tag = await Tags.create({ name, description });
	return json(tag);
}