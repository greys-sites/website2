import UserRoutes from './users.js';

export default function routes(app) {
	new UserRoutes(app).init();
}