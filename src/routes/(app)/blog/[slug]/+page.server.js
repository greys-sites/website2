import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params, fetch }) => {
	var resp = await fetch(`/api/posts/${params.slug}`);
	var post = await resp.json();

	return { post }
}