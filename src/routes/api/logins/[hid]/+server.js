import { error, json } from '@sveltejs/kit';
import crypto from 'crypto-js';
import SHA3 from 'crypto-js/sha3.js';
import Logins from '$lib/data/logins.js';
import Users from '$lib/data/users.js';
import { LOGIN_ERRORS as ERRORS } from '$lib/strings.js';

export async function PATCH({ request, params, locals }) {
	if(!locals.user) return error(401);
	var hid = params.hid.toLowerCase();
	var data = await request.json();
	console.log(data);

	var user = await Users.get(hid);
	if(!user?.id) return error(404);
	
	var login = await Logins.getByUser(user.hid);
	if(!login) return error(404);

	var {
		current_password: cpass,
		new_password: npass,
		username
	} = data;

	if(npass) {
		var hash = SHA3(cpass + login.salt);
		if(hash != login.password && login.password?.length)
			return error(400, { errors: [ERRORS.invalid_password] });
	
		var salt = crypto.lib.WordArray.random(32).toString(crypto.enc.Base64);
		var password = SHA3(npass + salt).toString();
		login.password = password;
		login.salt = salt;
	}

	if(username) {
		var exists = await Logins.getByUsername(username);
		if(exists?.id && exists.user_id !== user.hid) return error(400, { errors: [ERRORS.username_exists] });
		login.username = username;
	}

	await login.save();
	return json();
}