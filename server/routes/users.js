import { Route } from './__models.js';

export default class UserRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/users', async (req, res) => {
			if(!req.user) return res.status(401).send();

			var users = await this.app.stores.users.getAll();
			return res.status(200).send(users);
		})

		this.app.get('/users/@me', async (req, res) => {
			if(!req.user) return res.status(401).send();
			console.log(req.user);
			
			var user = await this.app.stores.users.get(req.user.hid);
			if(!user?.id) return res.status(404).send();

			return res.status(200).send(user);
		})

		this.app.get('/users/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var user = await this.app.stores.users.get(hid);
			if(!user?.id) return res.status(404).send();
			return res.status(200).send(user);
		})

		this.app.post('/users', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);

			var user = await this.app.stores.users.create(data);
			return res.status(200).send(user);
		})

		this.app.patch('/users/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var user = await this.app.stores.users.get(hid);
			if(!user?.id) return res.status(404).send();
			console.log("before", user);

			for(var k in data) {
				user[k] = data[k];
			}
			await user.save();
			console.log("after", user);
			return res.status(200).send(user);
		})

		this.app.delete('/users/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var user = await this.app.stores.users.get(hid);
			if(!user?.id) return res.status(404).send();

			await user.delete();
			return res.status(200).send();
		})
	}
}