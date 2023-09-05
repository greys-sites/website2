import { json, fail } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const POST = async ({ cookies, request }) => {
	var u = cookies.get('user');
	console.log('api cookie:', u);
	var { hid } = await request.json();

	try {
		var resp = await axios.delete(API + '/posts/' + hid, {
			headers: {
				'Authorization': u
			}
		});

		if(resp) {
			return json({
				success: true
			}, { status: 200 })
		};
	} catch(e) {
		console.log(e);
		return json({
			success: false
		}, {
			status: e.response?.status ?? 400,
			message: e.response?.statusText ?? "Something went wrong."
		});
	}
}