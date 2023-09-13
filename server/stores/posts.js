import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	title: { patch: true },
	user_id: { patch: true },
	body: { patch: true },
	short: { patch: true },
	cover_url: { patch: true },
	post_timestamp: { },
	edit_timestamp: { patch: true },
	tags: { patch: true }
}

export class Post extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}

	async getUser() {
		if(this.user) return user;
		var exists = this.store.userCache.get(this.user_id);
		if(exists) this.user = exists;
		else {
			var d = await this.store.db.query(`select * from users where hid = $1`, [this.user_id]);
			this.user = d.rows?.[0];
			if(this.user) this.store.userCache.set(this.user.user_id, this.user);
		}
		
		return this.user;
	}

	async getTags() {
		var d = await this.store.db.query(`
			select * from tags
			where hid = ANY($1)`, [this.tags]);
		this.full_tags = d.rows?.length ? d.rows : [];
		return this.full_tags;
	}
}

export default class PostStore extends DataStore {
	constructor(db) {
		super(db);

		this.userCache = new Map();
		setInterval(() => this.userCache.clear(), 10 * 60 * 1000)
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into posts (
					hid,
					title,
					user_id,
					body,
					short,
					cover_url,
					post_timestamp,
					edit_timestamp,
					tags
				) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				returning *
			`, [data.hid, data.title, data.user_id, data.body, data.short, data.cover_url,
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