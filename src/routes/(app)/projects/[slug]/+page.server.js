import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params, fetch }) => {
	var resp = await fetch(`/api/projects/${params.slug}`);
	var project = await resp.json();

	return { project }
}