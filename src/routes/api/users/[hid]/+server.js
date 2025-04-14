import { error, json } from '@sveltejs/kit';
import Users from '$lib/data/users.js';

export async function GET({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid == '@me' ? locals.user.hid : params.hid;
	var user = await Users.get(hid);
	if(!user?.id) return error(404);
	return json(user);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid == '@me' ? locals.user.hid : params.hid;
	var data = await request.json();
	console.log(data);

	var user = await Users.get(hid);
	if(!user?.id) return error(404);
	
	for(var k in data) {
		user[k] = data[k];
	}
	await user.save();
	return json(user);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	if(['@me', locals.user.hid].includes(hid)) return error(400, "You can't delete yourself.");

	var user = await Users.get(hid);
	if(!user?.id) return error(404);

	await user.delete();
	return json();
}