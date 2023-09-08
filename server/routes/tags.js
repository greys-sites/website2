import { Route } from './__models.js';

export default class TagRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/tags', async (req, res) => {
			var tags = await this.app.stores.tags.getAll();
			var q = req.query;
			if(q?.posts == true) for(var t of tags) await t.getPosts();

			return res.status(200).send(tags);
		})

		this.app.get('/tags/:hid', async (req, res) => {
			var hid = req.params.hid;
			var q = req.query;
			
			var tag = await this.app.stores.tags.get(hid);
			if(!tag?.id) return res.status(404).send();

			if(q?.posts == true) await tag.getPosts();
			
			return res.status(200).send(tag);
		})

		this.app.post('/tags', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);

			var tag = await this.app.stores.tags.create(data);
			return res.status(200).send(tag);
		})

		this.app.patch('/tags/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var tag = await this.app.stores.tags.get(hid);
			if(!tag?.id) return res.status(404).send();

			for(var k in data) {
				tag[k] = data[k];
			}
			await tag.save();
			return res.status(200).send(tag);
		})

		this.app.delete('/tags/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var tag = await this.app.stores.tags.get(hid);
			if(!tag?.id) return res.status(404).send();

			await tag.delete();
			return res.status(200).send();
		})
	}
}