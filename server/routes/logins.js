import crypto from 'crypto-js';
import SHA3 from 'crypto-js/sha3.js';
import { Route } from './__models.js';

const ERRORS = {
	password: 'Password is required for new accounts',
	user: 'User ID is required for new accounts',
	username: 'Username is required for new accounts',
	invalid_user: 'Invalid user ID supplied'
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
			if(errs.length) return res.status(400).send({ errors: errs });

			var salt = crypto.randomBytes(32).toString('base64');
			var password = SHA3(req.body.password + salt).toString();
			var login = await this.app.logins.create({
				user_id: user.hid,
				username: req.body.username,
				password,
				salt
			})

			return res.status(200).send();
		})

		this.app.get('/logins', async (req, res) => {
			if(!req.user) return res.status(401).send();

			var logins = await this.app.stores.logins.getAll();

			return res.status(200).send(logins);
		})
	}
}