import { Pool } from 'pg';

import ComicStore from './comics';
import FlagStore from './flags';
import PostStore from './posts';
import ProjectStore from './projects';
import UserStore from './users';

const client = new Pool();

class Stores {
	constructor(db) {
		this.db = db;

		this.comics = new ComicStore(this.db);
		this.flags = new FlagStore(this.db);
		this.posts = new PostStore(this.db);
		this.projects = new ProjectStore(this.db);
		this.users = new UserStore(this.db);
	}

	async init() {
		await this.db.query(`
			CREATE TABLE IF NOT EXISTS comics (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				tagline 	TEXT,
				description TEXT,
				story 		TEXT
			);

			CREATE TABLE IF NOT EXISTS flags (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				category 	TEXT
			);

			CREATE TABLE IF NOT EXISTS posts (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				title 		TEXT,
				body 		TEXT,
				user_id 	TEXT,
				cover_url 	TEXT,
				timestamp 	TIMESTAMPTZ,
				tags		TEXT[]
			);

			CREATE TABLE IF NOT EXISTS projects (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				description TEXT,
				tags 		TEXT[]
			);

			CREATE TABLE IF NOT EXISTS users (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				password 	TEXT,
				salt 		TEXT,
				bio 		TEXT,
				avatar_url 	TEXT
			);
		`)
	}
}

export default stores = new Stores(client);