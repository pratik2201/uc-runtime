// src/resources/resourceManager.ts

import fs from "fs";
import path from "path";

export type FileTypes =
  | "cssFile"
  | "htmlFile"
  | "imageFile"
  | "textFile"
  | "rawFile"
  | "string"
  | "integer"
  | "float"
  | "boolean";
export type ValueType =
  | "string"
  | "number"
  | "float";

export interface valueEntry {
  type: ValueType;
  value: string;
}
export class fileEntry {
  type: FileTypes = 'textFile';
  value = '';
  resourceKey = undefined;
  filePath: string;
  // preloadRenderer = false;
  // preloadMain = false;
}

export class ResourceManager {
  //private static map = new Map<string, ResourceEntry>();
  private static valueMap = new Map<string, valueEntry>();
  static setValue(key: string, value, type: ValueType = "string") {
    this.valueMap.set(key, {
      type,
      value: '' + value
    });
  }
  static getValue(key: string): string | null {
    return this.valueMap.get(key)?.value ?? null;
  }
  static hasValue(key: string): boolean {
    return this.valueMap.has(key);
  }
  static getAllKeysOfValue(): string[] {
    return [...this.valueMap.keys()];
  }
  static getEntriesOfValue() {
    return Array.from(this.valueMap.entries());
  }


  static fileSource = new Map<string, fileEntry>();
  static getResource(resourceKey: string, type: FileTypes, valOrPath?: string) {
    let finfo = this.fileSource.get(resourceKey);
    if (finfo == undefined) {
      let buf: NonSharedBuffer;
      finfo = new fileEntry();
      switch (type) {
        case 'cssFile':
        case 'htmlFile':
        case 'rawFile':
        case 'textFile':
          valOrPath = path.normalize(valOrPath);
          if (!fs.existsSync(valOrPath)) return undefined;
          buf = fs.readFileSync(valOrPath);
          finfo.filePath = valOrPath;
          finfo.value = buf.toString("utf8");
          break;
        case 'imageFile':
          valOrPath = path.normalize(valOrPath);
          if (!fs.existsSync(valOrPath)) return undefined;
          buf = fs.readFileSync(valOrPath);
          const ext = path.extname(valOrPath).slice(1);
          finfo.filePath = valOrPath;
          finfo.value = `data:image/${ext};base64,${buf.toString("base64")}`;
          break;
        case 'string':
        case 'boolean':
        case 'float':
        case 'integer': finfo.value = valOrPath; break;
      }
      finfo.type = type;
      this.fileSource.set(resourceKey, finfo);
      return finfo;
    } else return finfo;
  }
  static hasFiles(resourceKey: string): boolean {
    return this.fileSource.has(resourceKey);
  }
  static getEntriesOfFile() {
    return Array.from(this.fileSource.entries());
  }





  // helpers
  // static css(key: string) {
  //   return this.get(key);
  // }

  // static html(key: string) {
  //   return this.get(key);
  // }

  // static image(key: string) {
  //   return this.get(key);
  // }
}
function isSamePath(path1: string, path2: string) {
  const absA = path.resolve(path1);
  const absB = path.resolve(path2);
  return (path.normalize(absA) === path.normalize(absB));
}
export const RM = ResourceManager;
