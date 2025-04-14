import { error, json } from '@sveltejs/kit';
import crypto from 'crypto-js';
import SHA3 from 'crypto-js/sha3.js';
import Logins from '$lib/data/logins.js';
import Users from '$lib/data/users.js';
import { LOGIN_ERRORS as ERRORS } from '$lib/strings.js';

export async function GET({ request, cookies, locals }) {
	if(!locals.user) return error(401);

	var logins = await Logins.getAll();
	logins = logins.map(x => {
		var {
			password,
			salt,
			token,
			... rest
		} = x.toJSON();

		return rest;
	})
	return json(logins);
}

export async function POST({ request, cookies, locals }) {
	if(!locals.user) return error(401);
	
	var errs = [];
	if(!req.body.password) errs.push(ERRORS.password);
	if(!req.body.username) errs.push(ERRORS.username);
	if(!req.body.user_id) errs.push(ERRORS.user);

	var user = await Users.get(req.body.user_id);
	if(!user?.id) errs.push(ERRORS.invalid_user);
	var exists = await Logins.getByUser(user.hid);
	if(exists && exists.password) errs.push(ERRORS.exists);
	exists = await Logins.getByUsername(req.body.username);
	if(exists?.id && exists.user_id !== req.body.user_id) errs.push(ERRORS.username_exists);
	if(errs.length) return res.status(400).send({ errors: errs });

	var salt = crypto.lib.WordArray.random(32).toString(crypto.enc.Base64);
	var password = SHA3(req.body.password + salt).toString();
	await Logins.create({
		user_id: user.hid,
		username: req.body.username,
		password,
		salt
	});

	return json();
}