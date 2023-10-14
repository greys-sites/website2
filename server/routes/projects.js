import { Route } from './__models.js';

export default class ProjectRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/projects', async (req, res) => {
			var projects = await this.app.stores.projects.getAll();
			
			return res.status(200).send(projects);
		})

		this.app.get('/projects/:hid', async (req, res) => {
			var hid = req.params.hid;

			var project = await this.app.stores.projects.get(hid);
			if(!project?.id) return res.status(404).send();
			return res.status(200).send(project);
		})

		this.app.post('/projects', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);

			var project = await this.app.stores.projects.create(data);
			return res.status(200).send(project);
		})

		this.app.patch('/projects/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var project = await this.app.stores.projects.get(hid);
			if(!project?.id) return res.status(404).send();
			console.log("before", project);

			for(var k in data) {
				project[k] = data[k];
			}
			await project.save();
			console.log("after", project);
			return res.status(200).send(project);
		})

		this.app.delete('/projects/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var project = await this.app.stores.projects.get(hid);
			if(!project?.id) return res.status(404).send();

			await project.delete();
			return res.status(200).send();
		})
	}
}