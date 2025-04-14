import { error, json } from '@sveltejs/kit';
import Comics from '$lib/data/comics.js';

export async function GET({ request, params, cookies }) {
	var comic = await Comics.get(params.hid);
	if(!comic?.id) return error(404);
	return json(comic);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var comic = await Comics.get(hid);
	if(!comic?.id) return error(404);
	
	for(var k in data) {
		comic[k] = data[k];
	}
	await comic.save();
	return json(comic);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var comic = await Comics.get(hid);
	if(!comic?.id) return error(404);

	await comic.delete();
	return json();
}