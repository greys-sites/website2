import { DataObject, DataStore } from './__models';

const KEYS = {
	id: { },
	hid: { },
	title: { patch: true },
	body: { patch: true },
	user_id: { patch: true },
	cover_url: { patch: true },
	post_timestamp: { },
	edit_timestamp: { patch: true },
	tags: { patch: true }
}

class Post extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

export default class PostStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into posts (
					hid,
					title,
					body,
					user_id,
					cover_url,
					post_timestamp,
					edit_timestamp,
					tags
				) values ($1, $2, $3, $4, $5, $6, $7, $8)
				returning *
			`, [data.hid, data.title, data.body, data.user_id, data.cover_url,
				data.post_timestamp ?? new Date(), data.edit_timestamp, data.tags ?? []]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from posts where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Post(this, KEYS, data.rows[0]);
		else return new Post(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from posts where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Post(this, KEYS, data.rows[0]);
		else return new Post(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from posts`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Post(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update posts SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from posts where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from posts`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}