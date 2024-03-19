import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export async function load({ cookies }) {
	var settings = cookies.get('settings');
	if(settings) settings = JSON.parse(settings)
	else settings = {};
	
	var d;
	try {
		d = await axios.get(API + `/comics`)
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			default:
				d = { comics: [] };
				break;
		}
	}

	return { comics: d, settings };
}