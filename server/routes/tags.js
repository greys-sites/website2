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
			var { name, description } = req.body;
			name = name?.toLowerCase().trim();
			if(!name?.length) return res.status(400).send('Tag names cannot be empty.');
			description = description?.trim() ?? "";

			var tag = await this.app.stores.tags.create({
				name,
				description
			});
			return res.status(200).send(tag);
		})

		this.app.post('/tags/bulk', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var tc = req.body;

			var tags = [];
			var errs = [];
			for(var i = 0; i < tc.length; i++) {
				var { name, description } = tc[i];
				name = name?.toLowerCase().trim();
				if(!name?.length) {
					errs.push("Tag names must not be empty.");
					continue;
				}
				
				description = description?.trim() ?? "";

				var tag = await this.app.stores.tags.create({
					name,
					description
				});
				tags.push(tag)
			}

			if(errs.length) return res.status(207).send({ tags, errs })
			else return res.status(200).send({ tags });
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