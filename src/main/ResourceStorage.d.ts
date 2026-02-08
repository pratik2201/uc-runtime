import { BuildResource } from "./enums.js";
export declare class ResourceStorage {
    private static map;
    static register(res: BuildResource): void;
    static bulkRegister(list: BuildResource[]): void;
    static has(key: string): boolean;
    static get(key: string): BuildResource;
    static getContent(key: string): any;
    static getByName(name: string): BuildResource;
    static getContentByName(name: string): any;
    static keys(): string[];
    static clear(): void;
}
