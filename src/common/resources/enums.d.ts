export interface AssemblyRegistry {
}
export declare type AssemblyList = keyof AssemblyRegistry;
export interface ResourceNamedRegistry {
}
export declare type ResourceNamedList = keyof ResourceNamedRegistry;
export interface ResourceKeyRegistry {
}
export declare type ResourceKeyList = keyof ResourceKeyRegistry;
export declare type BuildResourceType = "css" | "html" | "image" | "text" | "raw" | "data" | "string";
export declare class BuildResource {
    guid: string;
    encrypt?: boolean;
    name?: string;
    type: BuildResourceType;
    content: string;
    source?: string;
}
export declare class UserResource extends BuildResource {
    /**
     * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
     * THAT CSS AS PROJECT'S GLOBAL CSS
     */
    isGlobalCss?: boolean;
    importar?: string;
    project?: AssemblyList;
}
export declare class ResourceKeyBridge {
    static PREFIX: string;
    static SUFFIX: string;
    static PLACEHOLDER_RE: RegExp;
    static makeKey(key: string): string;
    static extractKey(placeholder: string): string | null;
    static findAll(text: string): string[];
    static replace(text: string, resolver: (key: string) => string): string;
    static isPlaceholder(value: string): boolean;
}
