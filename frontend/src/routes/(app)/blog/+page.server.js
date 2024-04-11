import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};

	var d;
	try {
		d = await axios.get(API + `/tags`);
		var tags = d.data;

		d = await axios.get(API + `/posts`);
		d = d.data;
		var pinned = [];
		var drafts = [];
		var posts = [];

		for(var p of d) {
			if(p.draft) drafts.push(p);
			else if(p.pinned) pinned.push(p);
			else posts.push(p)
		}
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { posts: [] };
				break;
		}
	}

	return {
		posts,
		tags,
		settings,
		pinned
	};
}