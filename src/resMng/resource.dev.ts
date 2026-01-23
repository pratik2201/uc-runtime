// src/resources/resource.dev.ts

import fs from "fs";
import path from "path";
import { RM, fileEntry, FileTypes, valueEntry } from "./resourceManager.js";
import { nodeFn } from "../renderer/nodeFn.js";
import { ProjectManage } from "../renderer/ipc/ProjectManage.js";
import { PathBridge } from "../global/pathBridge.js";
import { codeFileInfo } from "../global/codeFileInfo.js";
import { GetProject } from "../common/ipc/enumAndMore.js";
import url from "url";

 
 
type ResourceDef = fileEntry | valueEntry;

//const registry: ResourceDef[] = [];

// export function registerFileSync( 
//   filePath: string,
//   type: FileTypes,
//   registerOnLoad: boolean = false
// ): string {
//   //registry.push({ key, filePath, type,registerOnLoad });
//   //const prj = GetProject(filePath, PathBridge.source, url);
//   //console.log([filePath,prj.projectPath]);
  
//   const buf = fs.readFileSync(filePath);
//   let value: string;
//   if (type === "image") {
//     const ext = path.extname(filePath).slice(1);
//     value = `data:image/${ext};base64,${buf.toString("base64")}`;
//   } else {
//     value = buf.toString("utf8");
//   }
//   if (type == 'css') {
//     //value = 
//   }
//   RM.setValue(key, value, type, filePath,registerOnLoad);
//   return value;
// }

// export function registerValue(
//   key: string,
//   value: string,
//   type: FileTypes = "raw"
// ): void {
//   //registry.push({ key, value, type });
//   RM.setValue(key, value, type);
// }

// export function getRegistry(): [string, fileEntry][] {
//   return RM.getEntriesOfValue();
// }
