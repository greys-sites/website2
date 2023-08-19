import crypto from 'crypto-js';
import SHA3 from 'crypto-js/sha3.js';
import { Route } from './__models.js';

const ERRORS = {
	password: 'Password is required for new accounts',
	user: 'User ID is required for new accounts',
	username: 'Username is required for new accounts',
	invalid_user: 'Invalid user ID supplied',
	exists: "Login information already exists for that user"
}

export default class LoginRoutes extends Route {
	constructor(app) {
		super(app);
	}

	init() {
		this.app.post('/logins', async (req, res) => {
			if(!req.user) return res.status(401).send();

			var errs = [];
			if(!req.body.password) errs.push(ERRORS.password);
			if(!req.body.username) errs.push(ERRORS.username);
			if(!req.body.user_id) errs.push(ERRORS.user);

			var user = await this.app.users.get(req.body.user_id);
			if(!user?.id) errs.push(ERRORS.invalid_user);
			var exists = await this.app.logins.getByUser(user.hid);
			if(exists) errs.push(ERRORS.exists);
			if(errs.length) return res.status(400).send({ errors: errs });

			var salt = crypto.lib.WordArray.random(32).toString(crypto.enc.Base64);
			var password = SHA3(req.body.password + salt).toString();
			var login = await this.app.logins.create({
				user_id: user.hid,
				username: req.body.username,
				password,
				salt
			});

			return res.status(200).send();
		})

		this.app.get('/logins', async (req, res) => {
			if(!req.user) return res.status(401).send();

			var logins = await this.app.stores.logins.getAll();

			logins = logins.map(x => {
				var {
					password,
					salt,
					token,
					... rest
				} = x.toJSON();

				return rest;
			})
			console.log(logins);
			return res.status(200).send(logins);
		})

		this.app.patch('/logins/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid.toLowerCase();

			var user = await this.app.stores.users.get(hid);
			if(!user?.id) return res.status(404).send();
			
			var login = await this.app.stores.logins.getByUser(user.hid);
			if(!login) return res.status(404).send();

			var {
				current_password: cpass,
				new_password: npass,
				username
			} = req.body;

			if(npass) {
				var hash = SHA3(cpass + login.salt);
				if(hash != login.password && login.password?.length)
					return res.status(403).send({ errors: ["Current password is invalid"] });
			
				var salt = crypto.lib.WordArray.random(32).toString(crypto.enc.Base64);
				var password = SHA3(npass + salt).toString();
				login.password = password;
				login.salt = salt;
			}

			if(username) {
				var exists = wait this.app.logins.getByUsername(username);
				if(exists?.id) return res.status(400).send({ errors: [ "Username is already taken." ]})
				login.username = username;
			}

			await login.save();

			return res.status(200).send();
		})

		this.app.post('/logins/verify', async (req, res) => {
			var body = req.body;
			var login = await this.app.stores.logins.getByUsername(body.username);
			if(!login) return res.status(404).send();

			var user = await this.app.stores.users.get(login.user_id);
			if(!user?.id) return res.status(404).send();

			var r = await login.validate(body.username, body.password);
			if(r) return res.status(200).send({ user, login });
			else return res.status(400).send();
		})
	}
}