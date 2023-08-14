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
				story 		TEXT,
				images 		JSONB
			);

			CREATE TABLE IF NOT EXISTS flags (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				category 	TEXT,
				description TEXT,
				images 		JSONB
			);

			CREATE TABLE IF NOT EXISTS posts (
				id 				SERIAL PRIMARY KEY,
				hid 			TEXT,
				title 			TEXT,
				body 			TEXT,
				user_id 		TEXT,
				cover_url 		TEXT,
				post_timestamp 	TIMESTAMPTZ,
				edit_timestamp 	TIMESTAMPTZ,
				tags			TEXT[]
			);

			CREATE TABLE IF NOT EXISTS projects (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				description TEXT,
				category 	TEXT,
				tags 		TEXT[],
				images 		JSONB
			);

			CREATE TABLE IF NOT EXISTS users (
				id 			SERIAL PRIMARY KEY,
				hid 		TEXT,
				name 		TEXT,
				password 	TEXT,
				salt 		TEXT,
				bio 		TEXT,
				avatar_url 	TEXT,
				token 		TEXT
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

export default stores = new Stores(client);