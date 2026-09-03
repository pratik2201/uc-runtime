import { BuildResource, normalizeJSON, ResourceNamedRegistry, safeStringify } from "ap-shared-core/core-common.js";
import { decryptResource } from "ap-shared-core/core-main.js";
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { Assembly, AssemblyManager } from "uc-runtime/src/core-main";


declare module "ap-shared-core/core-common.js" {
  export interface BuildResource {
    assembly?: Assembly;
  }
}
export function UpdateResourcePath(row: Assembly,prePath: string = "") {
  let projPath = '';
  row.ResourceStorageDir = join(prePath, row.ResourceStorageDir);
  let pth = resolve(row.ResourceStorageDir);
  if (existsSync(pth)) {
    row.ResourceStorageDir = pth;
  } else {
    pth = resolve('node_modules', row.name, row.ResourceStorageDir);
    if (existsSync(pth))
      row.ResourceStorageDir = pth;
  } 
  // let fpath = join(process.resourcesPath, row.ResourceStorageDir);
  // if (!existsSync(fpath)) {
  //   fpath = join(process.resourcesPath, 'node_modules', row.name, row.ResourceStorageDir);
  //   if (existsSync(fpath))
  //     row.ResourceStorageDir = fpath;
  // } else row.ResourceStorageDir = fpath;
  return row;
}

//let s = AssemblyManager.Parse(key as any);
//   console.log(s);

const cache = new Map<string, string>();
function getCache(key: string, res: BuildResource) {
  if (res == undefined) return null;
  if (cache.has(key)) return cache.get(key);
  else {
    if (res.assembly == undefined) {
      const guid = res.guid;
      const guidR = (guid as string).split(':');
      const projName = guidR?.shift();
      const resId = guidR?.pop();
      res.assembly = AssemblyManager.assemblies[projName];
      if (res.content == undefined) {
        const resPath = resolve(  res.assembly.ResourceStorageDir, `${projName}_${resId}.res`);
        res.content = readFileSync(resPath, 'utf-8');
      }
    }
    if (res.content == undefined) return undefined;
    let v = res.encrypt ? decryptResource(res.content) : res.content;
    v = safeStringify(v);
    cache.set(key, v);
    return normalizeJSON(v);
  }
}
export class ResourceStorage {
  static RuntimeProps: any = {} as any;

  private static map = new Map<string, BuildResource>();

  static register(res: BuildResource) {

    //console.log(resolve('files'));

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
  static getByName(name: keyof ResourceNamedRegistry) {
    let v = Array.from(this.map.values()).find(s => s.name == name);
    if (v != undefined) {
      v = JSON.parse(JSON.stringify(v));
      v.content = getCache(name, v);
    }
    return v;
    //return this.map.values().find(s => s.name == name) ?? null;
  }

  static getContentByName(name: keyof ResourceNamedRegistry) {
    let v = Array.from(this.map.values()).find(s => s.name == name);//?.content ?? null;
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
