import { normalizeJSON, safeStringify } from "ap-shared-core/out/objectUtil.js";
import { decryptResource } from "ap-shared-core/out/uc-runtime/resources/cryptoResource.js";
const cache = new Map();
function getCache(key, res) {
    if (res == undefined)
        return null;
    if (cache.has(key))
        return cache.get(key);
    else {
        if (res.content == undefined)
            return undefined;
        let v = res.encrypt ? decryptResource(res.content) : res.content;
        v = safeStringify(v);
        cache.set(key, v);
        return normalizeJSON(v);
    }
}
export class ResourceStorage {
    static RuntimeProps = {};
    static map = new Map();
    static register(res) {
        if (this.map.has(res.guid)) {
            const i = this.map.get(res.guid);
            console.log(`'${res.guid}' is already registered for resource => source='${i.source}' and type='${i.type}' <=`);
            return;
        }
        this.map.set(res.guid, res);
    }
    static bulkRegister(list) {
        for (const r of list)
            this.register(r);
    }
    static has(key) {
        return this.map.has(key);
    }
    static get(key) {
        let v = this.map.get(key);
        if (v != undefined) {
            v = JSON.parse(JSON.stringify(v));
            v.content = getCache(key, v);
        }
        return v ?? null;
    }
    static getContent(key) {
        let v = this.map.get(key);
        return getCache(key, v) ?? null; // this.map.get(key)?.content ?? null;
    }
    static getByName(name) {
        let v = this.map.values().find(s => s.name == name);
        if (v != undefined) {
            v = JSON.parse(JSON.stringify(v));
            v.content = getCache(name, v);
        }
        return v;
        //return this.map.values().find(s => s.name == name) ?? null;
    }
    static getContentByName(name) {
        let v = this.map.values().find(s => s.name == name); //?.content ?? null;
        return getCache(name, v); //this.map.values().find(s => s.name == name)?.content ?? null;
    }
    static keys() {
        return [...this.map.keys()];
    }
    static clear() {
        this.map.clear();
        cache.clear();
    }
}
//# sourceMappingURL=ResourceStorage.js.map