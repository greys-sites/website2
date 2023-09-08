import UserRoutes from './users.js';
import LoginRoutes from './logins.js';
import ProjectRoutes from './projects.js';
import ComicRoutes  from './comics.js';
import FlagRoutes from './flags.js';
import PostRoutes from './posts.js';
import TagRoutes from './tags.js';

export default function routes(app) {
	new UserRoutes(app).init();
	new LoginRoutes(app).init();
	new ProjectRoutes(app).init();
	new ComicRoutes(app).init();
	new FlagRoutes(app).init();
	new PostRoutes(app).init();
	new TagRoutes(app).init();
}