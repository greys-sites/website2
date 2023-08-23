import crypto from 'crypto-js';
import SHA3 from 'crypto-js/sha3.js';
import util from 'util';
import { DataObject, DataStore } from './__models.js';

const KEYS = {
	id: { },
	hid: { },
	user_id: { },
	username: { patch: true },
	password: { patch: true },
	salt: { patch: true },
	token: { patch: true }
}

export class Login extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}

	[util.inspect.custom](depth, opts) {
		var {store, KEYS, old, password, token, ...rest} = this;

		return rest;
	}

	async validate(name, password) {
		if(name !== this.username) return false;
		
		var hash = SHA3(password + this.salt).toString();
		if(this.password !== hash) return false;

		return true;
	}
}

export default class LoginStore extends DataStore {
	constructor(db) {
		super(db);
	}

	async create(data = {}) {
		try {
			var data = await this.db.query(`
				insert into logins (
					hid,
					user_id,
					username,
					password,
					salt,
					token
				) values ($1, $2, $3, $4, $5, gen_token())
				returning *
			`, [data.hid, data.user_id, data.username, data.password, data.salt]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		return await this.getID(data.rows[0].id);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from logins where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Login(this, KEYS, data.rows[0]);
		else return new Login(this, KEYS, { });
	}

	async getByToken(token) {
		try {
			var data = await this.db.query(`select * from logins where token = $1`, [token]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Login(this, KEYS, data.rows[0]);
		else return null;
	}

	async getByUser(hid) {
		try {
			var data = await this.db.query(`select * from logins where user_id = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Login(this, KEYS, data.rows[0]);
		else return null;
	}

	async getByUsername(username) {
		try {
			var data = await this.db.query(`select * from logins where username = $1`, [username]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Login(this, KEYS, data.rows[0]);
		else return null;
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from logins where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return new Login(this, KEYS, data.rows[0]);
		else return new Login(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from logins`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}

		if(data.rows?.[0]) return data.rows.map(x => new Login(this, KEYS, x));
		else return [];
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`
				update logins SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")}
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
			await this.db.query(`delete from logins where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from logins`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message ?? e);
		}
		
		return;
	}
}