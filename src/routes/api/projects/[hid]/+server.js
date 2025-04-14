import { error, json } from '@sveltejs/kit';
import Projects from '$lib/data/projects.js';

export async function GET({ request, params, cookies }) {
	var project = await Projects.get(params.hid);
	if(!project?.id) return error(404);
	return json(project);
}

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;
	var data = await request.json();
	console.log(data);

	var project = await Projects.get(hid);
	if(!project?.id) return error(404);
	
	for(var k in data) {
		project[k] = data[k];
	}
	await project.save();
	return json(project);
}

export async function DELETE({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid;

	var project = await Projects.get(hid);
	if(!project?.id) return error(404);

	await project.delete();
	return json();
}