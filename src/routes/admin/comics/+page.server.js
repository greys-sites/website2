import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies, fetch }) {
	var u = cookies.get('user');
	if(!u) {
		redirect(307, '/admin');
	}

	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await fetch(API + `/comics`, {
			headers: {
				'Authorization': u
			}
		})
		d = await d.json();
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				/* @migration task: add path argument */ cookies.delete('user');
				redirect(307, '/admin');
				break;
			default:
				d = { posts: [] };
				break;
		}
	}

	d = d.sort((a, b) => a.id - b.id);
	var categories = {};
	for(let c of d) {
		if(!categories[c.story]) {
			categories[c.story] = {
				name: c.story,
				comics: [c]
			};
		} else if(!categories[c.story].comics.find(x => x.hid == c.hid)) {
			categories[c.story].comics.push(c)
		}
	}
	console.log("server", categories)
	return { categories, comics: d, settings };
}