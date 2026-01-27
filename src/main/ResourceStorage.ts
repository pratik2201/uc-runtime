import { BuildResource } from "../enumAndMore.js";
import { decryptResource } from "./cryptoResource.js";


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
    return this.map.get(key) ?? null;
  }

  static getContent(key: string) {
    return this.map.get(key)?.content ?? null;
  }

  static keys() {
    return [...this.map.keys()];
  }

  static clear() {
    this.map.clear();
  }
}
