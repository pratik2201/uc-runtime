
import { safeStringify, normalizeJSON } from "ap-shared-core/out/objectUtil.js";
import { decryptResource } from "ap-shared-core/out/uc-control/resources/cryptoResource.js";
import { BuildResource } from "src/common/resources/enums";

const cache = new Map<string, string>();

function getCache(key: string, res: BuildResource) {
  if (res == undefined) return null;
  if (cache.has(key)) return cache.get(key);
  else {
    if (res.content == undefined) return undefined;
    let v = res.encrypt ? decryptResource(res.content) : res.content;
    v = safeStringify(v);
    cache.set(key, v);
    return normalizeJSON(v);
  }
}
export class ResourceStorage { 
  static RuntimeProps: any = {} as any
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
      v.content = getCache(key, v);
    }
    return v ?? null;
  }

  static getContent(key: string) {
    let v = this.map.get(key);
    return getCache(key, v) ?? null; // this.map.get(key)?.content ?? null;
  }
  static getByName(name: string) {
    let v = this.map.values().find(s => s.name == name);
    if (v != undefined) {
      v = JSON.parse(JSON.stringify(v));
      v.content = getCache(name, v);
    }
    return v;
    //return this.map.values().find(s => s.name == name) ?? null;
  }

  static getContentByName(name: string) {
    let v = this.map.values().find(s => s.name == name);//?.content ?? null;
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
