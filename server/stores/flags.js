import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	category: { patch: true },
	description: { patch: true },
	thumbnail: { patch: true },
	images: {
		patch: true,
		transform: (x) => JSON.stringify(x)
	}
}

export class Flag extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

export default class FlagStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into flags (
					hid,
					name,
					category,
					description,
					thumbnail,
					images
				) values ($1, $2, $3, $4, $5, $6)
				returning *
			`, [data.hid, data.name, data.category, data.description,
				data.thumbnail, data.images ? JSON.stringify(data.images) : JSON.stringify([])]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from flags where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Flag(this, KEYS, data.rows[0]);
		else return new Flag(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from flags where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Flag(this, KEYS, data.rows[0]);
		else return new Flag(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from flags`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Flag(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update flags SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from flags where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from flags`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}