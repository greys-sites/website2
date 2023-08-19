import { Route } from './__models.js';

export default class ComicRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/comics', async (req, res) => {
			var comics = await this.app.stores.comics.getAll();
			return res.status(200).send(comics);
		})

		this.app.get('/comics/:hid', async (req, res) => {
			var hid = req.params.hid;

			var comic = await this.app.stores.comics.get(hid);
			if(!comic?.id) return res.status(404).send();
			return res.status(200).send(comic);
		})

		this.app.post('/comics', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);

			var comic = await this.app.stores.comics.create(data);
			return res.status(200).send(comic);
		})

		this.app.patch('/comics/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var comic = await this.app.stores.comics.get(hid);
			if(!comic?.id) return res.status(404).send();
			console.log("before", comic);

			for(var k in data) {
				comic[k] = data[k];
			}
			await comic.save();
			console.log("after", comic);
			return res.status(200).send(comic);
		})

		this.app.delete('/comics/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var comic = await this.app.stores.comics.get(hid);
			if(!comic?.id) return res.status(404).send();

			await comic.delete();
			return res.status(200).send();
		})
	}
}