// src/resources/resourceManager.ts

export type ResourceType =
  | "css"
  | "html"
  | "image"
  | "text"
  | "raw";

export interface ResourceEntry {
  type: ResourceType;
  value: string;
  filePath: string;
  loadOnStart: boolean;
}

export class ResourceManager {
  private static map = new Map<string, ResourceEntry>();

  static set(key: string, value: string, type: ResourceType = "raw", filePath?: string, loadOnStart?: boolean) {
    this.map.set(key, { value, type, filePath, loadOnStart });
  }

  static get(key: string): string | null {
    return this.map.get(key)?.value ?? null;
  }

  // static info(key: string): ResourceEntry | null {
  //   return this.map.get(key) ?? null;
  // }

  static has(key: string): boolean {
    return this.map.has(key);
  }

  static keys(): string[] {
    return [...this.map.keys()];
  }

  static entries() {
    return this.map.entries();
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

export const RM = ResourceManager;
