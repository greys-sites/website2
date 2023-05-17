import express from 'express';
import routes from './routes';
import stores from './stores';

const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.stores = stores;

async function setup() {
	for(var route of routes) {
		await route.init(app);
	}
}

setup()
	.then(() => {
		app.listen(PORT);
		console.log('listening on port ' + PORT)
	})
	.catch(console.error);