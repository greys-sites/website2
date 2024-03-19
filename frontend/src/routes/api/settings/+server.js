import { error, json } from '@sveltejs/kit';

const KEYS = [
	'view_type'
]

export async function POST({ request, cookies }) {
	var data = await request.formData();
	var ck = cookies.get('settings');
	if(ck) ck = JSON.parse(ck);
	else ck = {
		view_type: "card"
	}

	for(var k of KEYS) {
		var item = data.get(k);
		if(item) ck[k] = item;
	}

	cookies.set('settings', JSON.stringify(ck), {
		path: '/'
	})

	return json(ck);
}