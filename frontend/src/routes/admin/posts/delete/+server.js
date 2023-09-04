import { json, fail } from '@sveltejs/kit';
import axios from 'axios';
import { API } from '$env/static/private';

export const POST = async ({ cookies, request }) => {
	var u = cookies.get('user');
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
		} else return fail(400, {
			success: false,
			status: 400,
			message: "Something went wrong."
		});
	} catch(e) {
		console.log(e);
		return fail(400, {
			success: false,
			status: 400,
			message: "Something went wrong."
		});
	}
}