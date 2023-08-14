import 'dotenv/config';
import express from 'express';
import routes from './routes/index.js';
import stores from './stores/index.js';

const PORT = process.env.BACK_PORT ?? 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.stores = stores;

async function auth(req, res, next) {
	console.log(req.headers);
	var token = req.headers?.['authorization'];
	console.log(token);
	if(!token) return next();

	var user = await app.stores.users.getByToken(token);
	console.log(user);
	if(!user) return next();

	req.user = user;
	next();
}

app.use(auth);
async function setup() {
	await routes(app);
	await stores.init();
}

setup()
	.then(() => {
		app.listen(PORT);
		console.log('listening on port ' + PORT)
	})
	.catch(console.error);