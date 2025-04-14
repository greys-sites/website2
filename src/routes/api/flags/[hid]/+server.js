import { error, json } from '@sveltejs/kit';
import Flags from '$lib/data/flags.js';

export async function GET({ request, params, cookies }) {
	var flag = await Flags.get(params.hid);
	if(!flag?.id) return error(404);
	return json(flag);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var flag = await Flags.get(hid);
	if(!flag?.id) return error(404);
	
	for(var k in data) {
		flag[k] = data[k];
	}
	await flag.save();
	return json(flag);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var flag = await Flags.get(hid);
	if(!flag?.id) return error(404);

	await flag.delete();
	return json();
}