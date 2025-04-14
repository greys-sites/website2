import { error, json } from '@sveltejs/kit';
import Flags from '$lib/data/flags.js';

export async function GET({ request, cookies }) {
	var flags = await Flags.getAll();
	return json(flags);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var flag = await Flags.create(data);
	return json(flag);
}