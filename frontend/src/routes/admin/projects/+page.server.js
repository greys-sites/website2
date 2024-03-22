import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) {
		redirect(307, '/admin');
	}

	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await axios.get(API + `/projects`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
		console.log(d)
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				/* @migration task: add path argument */ cookies.delete('user');
				redirect(307, '/admin');
				break;
			default:
				d = { projects: [] };
				break;
		}
	}

	return { projects: d, settings };
}