import { error, json } from '@sveltejs/kit';
import Supporters from '$lib/data/supporters.js';

export async function GET({ request, params, cookies }) {
	var supporter = await Supporters.get(params.hid);
	if(!supporter?.id) return error(404);
	return json(supporter);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var supporter = await Supporters.get(hid);
	if(!supporter?.id) return error(404);
	
	for(var k in data) {
		supporter[k] = data[k];
	}
	await supporter.save();
	return json(supporter);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var supporter = await Supporters.get(hid);
	if(!supporter?.id) return error(404);

	await supporter.delete();
	return json();
}