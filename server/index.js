import express from 'express';
import routes from './routes';
import stores from './stores';

const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.stores = stores;

async function auth(req, res, next) {
	var token = req.headers?.['Authorization'];
	if(!token) return next();

	var user = await app.stores.users.getByToken(token);
	if(!user) return next();

	req.user = user;
	next();
}

app.use(auth);
async function setup() {
	await routes(app);
}

setup()
	.then(() => {
		app.listen(PORT);
		console.log('listening on port ' + PORT)
	})
	.catch(console.error);