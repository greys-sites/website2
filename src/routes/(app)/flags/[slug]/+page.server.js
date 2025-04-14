import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const load = async ({ cookies, params, fetch }) => {
	var resp = await fetch(`/api/flags/${params.slug}`);
	var flag = await resp.json();

	return { flag }
}