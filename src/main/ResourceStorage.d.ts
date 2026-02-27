import { BuildResource, ResourceNamedRegistry } from "ap-shared-core/out/enums.js";
export declare class ResourceStorage {
    static RuntimeProps: any;
    private static map;
    static register(res: BuildResource): void;
    static bulkRegister(list: BuildResource[]): void;
    static has(key: string): boolean;
    static get(key: string): BuildResource;
    static getContent(key: string): any;
    static getByName(name: keyof ResourceNamedRegistry): BuildResource;
    static getContentByName(name: keyof ResourceNamedRegistry): any;
    static keys(): string[];
    static clear(): void;
}
