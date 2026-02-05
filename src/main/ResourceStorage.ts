
import { BuildResource } from "ap-shared-core/out/ucbuilder/resources/enums.js";
import { normalizeJSON, safeStringify } from "ap-shared-core/out/objectUtil.js";
import { decryptResource } from "./cryptoResource.js";

const cache = new Map<string, string>();
function getCache(key: string, content: string) {
  if (cache.has(key)) return cache.get(key);
  else {
    if (content == undefined) return undefined;
    const v = decryptResource(content);
    cache.set(key, safeStringify(v));
    return normalizeJSON(v);
  }
}
export class ResourceStorage {

  private static map = new Map<string, BuildResource>();

  static register(res: BuildResource) {
    if (this.map.has(res.guid)) {
      const i = this.map.get(res.guid);
      console.log(`'${res.guid}' is already registered for resource => source='${i.source}' and type='${i.type}' <=`);
      return;
    }
    this.map.set(res.guid, res);
  }

  static bulkRegister(list: BuildResource[]) {
    for (const r of list) this.register(r);
  }

  static has(key: string) {
    return this.map.has(key);
  }

  static get(key: string) {
    let v = this.map.get(key);
    if (v != undefined) {
      v = JSON.parse(JSON.stringify(v));
      v.content = getCache(key, v.content);
    }
    return v ?? null;
  }

  static getContent(key: string) {
    let v = this.map.get(key);
    return getCache(key, v.content) ?? null; // this.map.get(key)?.content ?? null;
  }
  static getByName(name: string) {
    let v = this.map.values().find(s => s.name == name);
    if (v != undefined) {
      v = JSON.parse(JSON.stringify(v));
      v.content = getCache(name, v.content);
    }
    return v;
    //return this.map.values().find(s => s.name == name) ?? null;
  }

  static getContentByName(name: string) {
    let v = this.map.values().find(s => s.name == name)?.content ?? null;
    return getCache(name, v);//this.map.values().find(s => s.name == name)?.content ?? null;
  }

  static keys() {
    return [...this.map.keys()];
  }

  static clear() {
    this.map.clear();
    cache.clear();
  }
}
