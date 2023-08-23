import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	description: { patch: true },
	category: { patch: true },
	tags: { patch: true },
	images: {
		patch: true,
		transform: (x) => JSON.stringify(x)
	}
}

export class Project extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

export default class ProjectStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into projects (
					hid,
					name,
					description,
					category,
					tags,
					images
				) values ($1, $2, $3, $4, $5, $6)
				returning *
			`, [data.hid, data.name, data.description, data.category, data.tags ?? [], data.images ?? JSON.stringify([])]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from projects where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Project(this, KEYS, data.rows[0]);
		else return new Project(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from projects where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Project(this, KEYS, data.rows[0]);
		else return new Project(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from projects`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Project(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update projects SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from projects where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from projects`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}