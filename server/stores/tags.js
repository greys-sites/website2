import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	description: { patch: true }
}

export class Tag extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}

	async getPosts() {
		var d = await this.store.db.query(`
			select * from posts where $1 = ANY(tags)
		`, [this.hid]);

		if(d.rows?.[0]) this.posts = d.rows;
		else this.posts = [];

		return this.posts;
	}
}

export default class TagStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into tags (
					hid,
					name,
					description
				) values (find_unique('tags'), $1, $2)
				returning *
			`, [data.name, data.description]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from tags where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Tag(this, KEYS, data.rows[0]);
		else return new Tag(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from tags where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Tag(this, KEYS, data.rows[0]);
		else return new Tag(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from tags`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Tag(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update tags SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
				where id = $1
			`, [id, ...Object.values(data)]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(id);
	}

	async delete(id) {
		try {
			await this.db.query(`delete from tags where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from tags`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}