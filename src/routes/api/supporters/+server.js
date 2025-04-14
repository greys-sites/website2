import { error, json } from '@sveltejs/kit';
import Supporters from '$lib/data/supporters.js';

export async function GET({ request, cookies }) {
	var supporters = await Supporters.getAll();
	return json(supporters);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var supporter = await Supporters.create(data);
	return json(supporter);
}