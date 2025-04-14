import Logins from '$lib/data/logins.js';
import Users from '$lib/data/users.js';

export async function handle({ event, resolve }) {
	var tk = event.cookies.get('user');
	if(!tk) tk = event.request.headers.get('authorization');

	var login = await Logins.getByToken(tk);
	if(!login) return await resolve(event);
	var user = await Users.get(login.user_id);

	if(user?.id) event.locals.user = user;
	const response = await resolve(event);
	return response;
}