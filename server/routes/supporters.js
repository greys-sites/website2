import { Route } from './__models.js';

export default class SupporterRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/supporters', async (req, res) => {
			var supps = await this.app.stores.supporters.getAll();
			return res.status(200).send(supps);
		})

		this.app.get('/supporters/:hid', async (req, res) => {
			var hid = req.params.hid;

			var supp = await this.app.stores.supporters.get(hid);
			if(!supp?.id) return res.status(404).send();
			return res.status(200).send(supp);
		})

		this.app.post('/supporters', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;

			var supp = await this.app.stores.supporters.create(data);
			return res.status(200).send(supp);
		})

		this.app.patch('/supporters/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;

			var supp = await this.app.stores.supporters.get(hid);
			if(!supp?.id) return res.status(404).send();

			for(var k in data) {
				supp[k] = data[k];
			}
			await supp.save();
			return res.status(200).send(supp);
		})

		this.app.delete('/supporters/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var supp = await this.app.stores.supporters.get(hid);
			if(!supp?.id) return res.status(404).send();

			await supp.delete();
			return res.status(200).send();
		})
	}
}