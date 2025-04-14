import { error, json } from '@sveltejs/kit';
import Users from '$lib/data/users.js';

export async function GET({ request, locals }) {
	if(!locals.user) return error(401);
	
	var users = await Users.getAll();
	return json(users);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var user = await Users.create(data);
	return json(user);
}