import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	var u = cookies.get('user');
	if(!u) throw redirect(308, '/login');

	var d;
	try {
		d = await axios.get(API + `/users/@me`, {
			headers: {
				'Authorization': u
			}
		})
		d = d.data;
	} catch(e) {
		console.log(e.response ?? e);
		switch(e.response?.status) {
			case 401:
				cookies.delete('user');
				d = { user: null };
				break;
			default:
				d = { user: null };
				break;
		}
	}

	return { user: d };
}