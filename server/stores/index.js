import pg from 'pg';
const { Pool } = pg;

import ComicStore from './comics.js';
import FlagStore from './flags.js';
import PostStore from './posts.js';
import ProjectStore from './projects.js';
import UserStore from './users.js';
import LoginStore from './logins.js';
import TagStore from './tags.js'

const client = new Pool();

class Stores {
	constructor(db) {
		this.db = db;

		this.comics = new ComicStore(this.db);
		this.flags = new FlagStore(this.db);
		this.posts = new PostStore(this.db);
		this.projects = new ProjectStore(this.db);
		this.users = new UserStore(this.db);
		this.logins = new LoginStore(this.db);
		this.tags = new TagStore(this.db);
	}

	async init() {
		await this.db.query(`
			CREATE TABLE IF NOT EXISTS comics (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				tagline 	TEXT,
				description TEXT,
				story 		TEXT,
				thumbnail	TEXT,
				images 		JSONB
			);

			CREATE TABLE IF NOT EXISTS flags (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				category 	TEXT,
				description TEXT,
				thumbnail 	TEXT,
				images 		JSONB
			);

			CREATE TABLE IF NOT EXISTS posts (
				id 				SERIAL PRIMARY KEY,
				hid 			TEXT UNIQUE,
				title 			TEXT,
				user_id 		TEXT,
				body 			TEXT,
				short 			TEXT,
				cover_url 		TEXT,
				post_timestamp 	TIMESTAMPTZ,
				edit_timestamp 	TIMESTAMPTZ,
				tags			TEXT[],
				pinned			BOOLEAN
			);

			CREATE TABLE IF NOT EXISTS projects (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				short 		TEXT,
				description TEXT,
				cover_url	TEXT,
				category 	TEXT,
				tags 		TEXT[],
				images 		JSONB,
				featured	BOOLEAN
			);

			CREATE TABLE IF NOT EXISTS users (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT unique,
				name 		TEXT,
				bio 		TEXT,
				avatar_url 	TEXT
			);

			CREATE TABLE IF NOT EXISTS logins (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				user_id 	TEXT references users (hid) on delete cascade,
				username 	TEXT,
				password 	TEXT,
				salt 		TEXT,
				token 		TEXT
			);

			CREATE TABLE IF NOT EXISTS tags (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT unique,
				name 		TEXT,
				description TEXT
			);

			CREATE OR REPLACE FUNCTION gen_hid() RETURNS TEXT AS
				'select lower(substr(md5(random()::text), 0, 5));'
			LANGUAGE SQL VOLATILE;

			CREATE OR REPLACE FUNCTION find_unique(_tbl regclass) RETURNS TEXT AS $$
				DECLARE nhid TEXT;
				DECLARE res BOOL;
				BEGIN
					LOOP
						nhid := gen_hid();
						EXECUTE format(
							'SELECT (EXISTS (
								SELECT FROM %s
								WHERE hid = %L
							))::bool',
							_tbl, nhid
						) INTO res;
						IF NOT res THEN RETURN nhid; END IF;
					END LOOP;
				END
			$$ LANGUAGE PLPGSQL VOLATILE;

			CREATE OR REPLACE FUNCTION gen_token() RETURNS TEXT AS
				'select substr(md5(random()::text), 0, 32);'
			LANGUAGE SQL VOLATILE;
		`)
	}
}

const stores = new Stores(client);
export default stores;