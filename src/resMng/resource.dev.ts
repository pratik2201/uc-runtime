// src/resources/resource.dev.ts

import fs from "fs";
import path from "path";
import { RM, ResourceType } from "./resourceManager.js";

export interface FileResource {
  key: string;
  filePath: string;
  type: ResourceType;
}

export interface ValueResource {
  key: string;
  value: string;
  type: ResourceType;
}

type ResourceDef = FileResource | ValueResource;

const registry: ResourceDef[] = [];

export function registerFileSync(
  key: string,
  filePath: string,
  type: ResourceType
): string { 
  registry.push({ key, filePath, type }); 
  const buf = fs.readFileSync(filePath); 
  let value: string; 
  if (type === "image") {
    const ext = path.extname(filePath).slice(1);
    value = `data:image/${ext};base64,${buf.toString("base64")}`;
  } else {
    value = buf.toString("utf8");
  } 
  RM.set(key, value, type,filePath);
  return value;
}

export function registerValue(
  key: string,
  value: string,
  type: ResourceType = "raw"
): void {
  registry.push({ key, value, type });
  RM.set(key, value, type);
}

export function getRegistry(): readonly ResourceDef[] {
  return registry;
}
