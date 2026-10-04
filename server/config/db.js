import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_STORE_PATH = path.join(__dirname, '../../data/db_store.json');

let isConnectedToNativeMongo = false;
let embeddedStore = {};

function loadEmbeddedStore() {
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const raw = fs.readFileSync(DATA_STORE_PATH, 'utf-8');
      embeddedStore = JSON.parse(raw);
    } else {
      embeddedStore = {};
    }
  } catch (err) {
    console.warn('[METALLO DB] Warning loading db_store.json:', err.message);
    embeddedStore = {};
  }
}

export function saveEmbeddedStore() {
  try {
    const dir = path.dirname(DATA_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(embeddedStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[METALLO DB] Error saving db_store.json:', err.message);
  }
}

function matchFilter(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (key === '$or') {
      if (!Array.isArray(val)) continue;
      const orMatched = val.some(subQuery => matchFilter(doc, subQuery));
      if (!orMatched) return false;
      continue;
    }
    const docVal = doc[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      for (const [op, opVal] of Object.entries(val)) {
        if (op === '$gte') {
          if (docVal < opVal) return false;
        } else if (op === '$lte') {
          if (docVal > opVal) return false;
        } else if (op === '$gt') {
          if (docVal <= opVal) return false;
        } else if (op === '$lt') {
          if (docVal >= opVal) return false;
        } else if (op === '$ne') {
          if (docVal === opVal) return false;
        } else if (op === '$in') {
          if (!Array.isArray(opVal) || !opVal.includes(docVal)) return false;
        } else if (op === '$nin') {
          if (Array.isArray(opVal) && opVal.includes(docVal)) return false;
        } else if (op === '$regex') {
          const reg = new RegExp(opVal, val.$options || '');
          if (!reg.test(String(docVal || ''))) return false;
        }
      }
    } else if (val instanceof RegExp) {
      if (!val.test(String(docVal || ''))) return false;
    } else {
      if (docVal !== val) {
        // loose equality for ObjectId strings
        if (String(docVal) !== String(val)) return false;
      }
    }
  }
  return true;
}

class QueryCursor {
  constructor(resultsPromise) {
    this.resultsPromise = resultsPromise;
    this._sortField = null;
    this._sortAsc = 1;
    this._limit = null;
    this._skip = 0;
  }

  sort(sortObj) {
    if (sortObj && typeof sortObj === 'object') {
      const [key, dir] = Object.entries(sortObj)[0] || [];
      this._sortField = key;
      this._sortAsc = dir === -1 || dir === 'desc' || dir === 'descending' ? -1 : 1;
    }
    return this;
  }

  limit(n) {
    this._limit = Number(n);
    return this;
  }

  skip(n) {
    this._skip = Number(n);
    return this;
  }

  lean() {
    return this;
  }

  select() {
    return this;
  }

  async exec() {
    let list = await this.resultsPromise;
    if (this._sortField) {
      const f = this._sortField;
      const asc = this._sortAsc;
      list = [...list].sort((a, b) => {
        const valA = a[f] instanceof Date ? a[f].getTime() : a[f];
        const valB = b[f] instanceof Date ? b[f].getTime() : b[f];
        if (valA < valB) return -1 * asc;
        if (valA > valB) return 1 * asc;
        return 0;
      });
    }
    if (this._skip > 0) {
      list = list.slice(this._skip);
    }
    if (this._limit !== null && this._limit !== undefined) {
      list = list.slice(0, this._limit);
    }
    return JSON.parse(JSON.stringify(list));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

class EmbeddedCollection {
  constructor(name) {
    this.name = name;
  }

  get items() {
    if (!embeddedStore[this.name]) {
      embeddedStore[this.name] = [];
    }
    return embeddedStore[this.name];
  }

  find(query = {}) {
    const list = this.items.filter(item => matchFilter(item, query));
    return new QueryCursor(Promise.resolve(list));
  }

  async findOne(query = {}) {
    const item = this.items.find(item => matchFilter(item, query));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findById(id) {
    const item = this.items.find(item => String(item._id) === String(id));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.items.findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;
    const current = this.items[index];
    const updated = {
      ...current,
      ...(update.$set || update),
      updatedAt: new Date().toISOString(),
    };
    this.items[index] = updated;
    saveEmbeddedStore();
    return JSON.parse(JSON.stringify(options.new !== false ? updated : current));
  }

  async create(data) {
    if (Array.isArray(data)) {
      return this.insertMany(data);
    }
    const doc = {
      _id: 'metallo_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(doc);
    saveEmbeddedStore();
    return JSON.parse(JSON.stringify(doc));
  }

  async insertMany(docs = []) {
    const created = docs.map(d => ({
      _id: d._id || 'metallo_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      ...d,
      createdAt: d.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    this.items.push(...created);
    saveEmbeddedStore();
    return JSON.parse(JSON.stringify(created));
  }

  async updateOne(query, update, options = {}) {
    const index = this.items.findIndex(item => matchFilter(item, query));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = {
          _id: 'metallo_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
          ...(query || {}),
          ...(update.$set || update),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.items.push(newDoc);
        saveEmbeddedStore();
        return { acknowledged: true, modifiedCount: 1, upsertedId: newDoc._id };
      }
      return { acknowledged: true, modifiedCount: 0 };
    }
    const current = this.items[index];
    this.items[index] = {
      ...current,
      ...(update.$set || update),
      updatedAt: new Date().toISOString()
    };
    saveEmbeddedStore();
    return { acknowledged: true, modifiedCount: 1 };
  }

  async updateMany(query, update) {
    let count = 0;
    this.items.forEach((item, idx) => {
      if (matchFilter(item, query)) {
        this.items[idx] = {
          ...item,
          ...(update.$set || update),
          updatedAt: new Date().toISOString()
        };
        count++;
      }
    });
    if (count > 0) saveEmbeddedStore();
    return { acknowledged: true, modifiedCount: count };
  }

  async deleteOne(query) {
    const index = this.items.findIndex(item => matchFilter(item, query));
    if (index !== -1) {
      this.items.splice(index, 1);
      saveEmbeddedStore();
      return { acknowledged: true, deletedCount: 1 };
    }
    return { acknowledged: true, deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    const initialLen = this.items.length;
    embeddedStore[this.name] = this.items.filter(item => !matchFilter(item, query));
    const deletedCount = initialLen - embeddedStore[this.name].length;
    if (deletedCount > 0) saveEmbeddedStore();
    return { acknowledged: true, deletedCount };
  }

  async countDocuments(query = {}) {
    return this.items.filter(item => matchFilter(item, query)).length;
  }
}

export function createUnifiedModel(name, mongooseSchema) {
  const embedded = new EmbeddedCollection(name);
  let MongooseModel = null;
  try {
    MongooseModel = mongoose.models[name] || mongoose.model(name, mongooseSchema);
  } catch {
    // schema register fallback
  }

  return {
    find: (q) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.find(q) : embedded.find(q),
    findOne: (q) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.findOne(q) : embedded.findOne(q),
    findById: (id) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.findById(id) : embedded.findById(id),
    findByIdAndUpdate: (id, u, o) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.findByIdAndUpdate(id, u, o) : embedded.findByIdAndUpdate(id, u, o),
    create: (d) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.create(d) : embedded.create(d),
    insertMany: (d) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.insertMany(d) : embedded.insertMany(d),
    updateOne: (q, u, o) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.updateOne(q, u, o) : embedded.updateOne(q, u, o),
    updateMany: (q, u) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.updateMany(q, u) : embedded.updateMany(q, u),
    deleteOne: (q) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.deleteOne(q) : embedded.deleteOne(q),
    deleteMany: (q) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.deleteMany(q) : embedded.deleteMany(q),
    countDocuments: (q) => isConnectedToNativeMongo && MongooseModel ? MongooseModel.countDocuments(q) : embedded.countDocuments(q),
  };
}

export async function connectDB() {
  loadEmbeddedStore();
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metallo';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    isConnectedToNativeMongo = true;
    console.log(`[METALLO DB] Connected to native MongoDB at ${mongoUri}`);
  } catch (err) {
    isConnectedToNativeMongo = false;
    console.log(`[METALLO DB] Local MongoDB unavailable (${err.message}). Active fallback: Persistent Embedded Mongo Document Store.`);
  }
}

export function isNativeMongoActive() {
  return isConnectedToNativeMongo;
}
