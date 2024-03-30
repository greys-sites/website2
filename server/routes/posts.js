import { Route } from './__models.js';

export default class PostRoutes extends Route {
	constructor(app) {
		super(app)
	}

	init() {
		this.app.get('/posts', async (req, res) => {
			var posts = await this.app.stores.posts.getAll();
			for(var p of posts) {
				await p.getUser();
				await p.getTags();
			}

			return res.status(200).send(posts);
		})

		this.app.get('/posts/recent', async (req, res) => {
			var posts = await this.app.stores.posts.getRecent();
			for(var p of posts) {
				await p.getUser();
				await p.getTags();
			}

			return res.status(200).send(posts);
		})

		this.app.get('/posts/:hid', async (req, res) => {
			var hid = req.params.hid;

			var post = await this.app.stores.posts.get(hid);
			if(!post?.id) return res.status(404).send();
			await post.getUser();
			await post.getTags();
			console.log(post)
			return res.status(200).send(post);
		})

		this.app.post('/posts', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var data = req.body;
			console.log(data);
			if(!data.hid) data.hid = data.title.replace(' ', '-').slice(0, 10).toLowerCase();

			var post = await this.app.stores.posts.create(data);
			return res.status(200).send(post);
		})

		this.app.patch('/posts/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;
			var data = req.body;
			console.log(data);

			var post = await this.app.stores.posts.get(hid);
			if(!post?.id) return res.status(404).send();
			console.log("before", post);

			for(var k in data) {
				post[k] = data[k];
			}
			await post.save();
			console.log("after", post);
			return res.status(200).send(post);
		})

		this.app.delete('/posts/:hid', async (req, res) => {
			if(!req.user) return res.status(401).send();
			var hid = req.params.hid;

			var post = await this.app.stores.posts.get(hid);
			if(!post?.id) return res.status(404).send();

			await post.delete();
			return res.status(200).send();
		})
	}
}