import util from 'util';

export class DataObject {
	store;

	constructor(store, keys, data = {}) {
		this.KEYS = keys;
		this.store = store;

		for(var k in keys)
			this[k] = data[k];
	}

	[util.inspect.custom](depth, opts) {
		var {store, KEYS, old, ...rest} = this;

		return rest;
	}

	toJSON() {
		var {
			store,
			KEYS,
			old,
			...rest
		} = this;

		return rest;
	}

	async fetch() {
		var data = await this.store.getID(this.id);
		for(var k in this.KEYS)
			this[k] = data[k];

		return this;
	}

	async save() {
		var obj = await this.verify((this.id != null));

		var data;
		if(this.id) data = await this.store.update(this.id, obj, this.old);
		else data = await this.store.create(obj);
		for(var k in this.KEYS) this[k] = data[k];
		this.old = Object.assign({}, data);
		return this;
	}

	async delete() {
		await this.store.delete(this.id);
	}

	async verify(patch = true) {
		var obj = {};
		var errors = []
		for(var k in this.KEYS) {
			if(!this.KEYS[k].patch && patch) continue;
			if(this[k] === undefined) continue;
			if(this[k] === null) {
				obj[k] = null;
				continue;
			}

			var test = true;
			if(this.KEYS[k].test) test = await this.KEYS[k].test(this[k]);
			if(!test) {
				errors.push(this.KEYS[k].err);
				continue;
			}
			if(this.KEYS[k].transform) obj[k] = this.KEYS[k].transform(this[k]);
			else obj[k] = this[k];
		}

		if(errors.length) throw new Error(errors.join("\n"));
		return obj;
	}
}

export class DataStore {
	db;

	constructor(db) {
		this.db = db;
	}

	[util.inspect.custom](depth, opts) {
		var {db, ...rest} = this;

		return rest;
	}

	async create(data) { }

	async get(data) { }
	async getID(id) { }
	async getAll(id) { }

	async update(id) { }

	async delete(data) { }
	async deleteAll(data) { }
}