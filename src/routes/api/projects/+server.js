import { error, json } from '@sveltejs/kit';
import Projects from '$lib/data/projects.js';

export async function GET({ request, url }) {
	var projects;
	let pinned = url.searchParams.get('pinned');
	if(pinned) projects = await Projects.getFeatured();
	else projects = await Projects.getAll();

	return json(projects);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	var data = await request.json();
	console.log(data);

	var project = await Projects.create(data);
	return json(project);
}