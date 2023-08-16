import UserRoutes from './users.js';
import LoginRoutes from './logins.js';

export default function routes(app) {
	new UserRoutes(app).init();
	new LoginRoutes(app).init();
}