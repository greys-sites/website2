import { error, json } from '@sveltejs/kit';
import Logins from '$lib/data/logins.js';
import Users from '$lib/data/users.js';

export async function POST({ request, locals }) {
	var body = await request.json();
	var login = await Logins.getByUsername(body.username);
	if(!login) return error(404);

	var user = await Users.get(login.user_id);
	if(!user?.id) return error(404);

	var r = await login.validate(body.username, body.password);
	if(r) return json({ user, login });
	else return error(400);
}