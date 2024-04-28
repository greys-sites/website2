import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	link: { patch: true }
}

export class Supporter extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

export default class SupporterStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into supporters (
					hid,
					name,
					link
				) values (find_unique('supporters'), $1, $2)
				returning *
			`, [data.name, data.link]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from supporters where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Supporter(this, KEYS, data.rows[0]);
		else return new Supporter(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from supporters where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Supporter(this, KEYS, data.rows[0]);
		else return new Supporter(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from supporters`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Supporter(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update supporters SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from supporters where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from supporters`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}