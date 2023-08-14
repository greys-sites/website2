import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	bio: { patch: true },
	avatar_url: { patch: true }
}

class User extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

export default class UserStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into users (
					hid,
					name,
					bio,
					avatar_url
				) values (find_unique('users'), $1, $2, $3)
				returning *
			`, [data.name, data.bio, data.avatar_url]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from users where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new User(this, KEYS, data.rows[0]);
		else return new User(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from users where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new User(this, KEYS, data.rows[0]);
		else return new User(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from users`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new User(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update users SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from users where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from users`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}