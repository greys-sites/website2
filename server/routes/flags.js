import { Route } from './__models.js';

export default class FlagRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/flags', async (req, res) => {
			var flags = await this.app.stores.flags.getAll();
			return res.status(200).send(flags);
		})

		this.app.get('/flags/:hid', async (req, res) => {
			var hid = req.params.hid;

			var flag = await this.app.stores.flags.get(hid);
			if(!flag?.id) return res.status(404).send();
			return res.status(200).send(flag);
		})

		this.app.post('/flags', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);

			var flag = await this.app.stores.flags.create(data);
			return res.status(200).send(flag);
		})

		this.app.patch('/flags/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var flag = await this.app.stores.flags.get(hid);
			if(!flag?.id) return res.status(404).send();
			console.log("before", flag);

			for(var k in data) {
				flag[k] = data[k];
			}
			await flag.save();
			console.log("after", flag);
			return res.status(200).send(flag);
		})

		this.app.delete('/flags/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var flag = await this.app.stores.flags.get(hid);
			if(!flag?.id) return res.status(404).send();

			await flag.delete();
			return res.status(200).send();
		})
	}
}