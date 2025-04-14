import { error, json } from '@sveltejs/kit';
import Comics from '$lib/data/comics.js';

export async function GET({ request, cookies }) {
	var comics = await Comics.getAll();
	return json(comics);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var comic = await Comics.create(data);
	return json(comic);
}