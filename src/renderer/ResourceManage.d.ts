import { ResourceKeyList, ResourceKeyRegistry, ResourceNamedRegistry } from "../core-main.js";
import { BuildResource } from "ap-shared-core/out/enums.js";
export declare class ResourceManage {
    static renderer: import("./ipc/IpcRendererHelper.js").IRelativeRendere;
    static x1: (res: string) => any;
    static x0: (res: string) => any;
    static register: (res: BuildResource) => void;
    static bulkRegister: (list: BuildResource[]) => any;
    static has: (key: ResourceKeyList) => boolean;
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static get: <K extends keyof ResourceKeyRegistry>(key: K, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?: ResourceKeyRegistry[K]) => BuildResource;
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns
     */
    static getContent: <K extends keyof ResourceKeyRegistry>(key: K, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?: ResourceKeyRegistry[K]) => string;
    static keys: () => string[];
    static clear: () => void;
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static getByName: <K extends keyof ResourceNamedRegistry>(name: K, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?: ResourceNamedRegistry[K]) => BuildResource;
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns
     */
    static getContentByName: <K extends keyof ResourceNamedRegistry>(name: K, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?: ResourceNamedRegistry[K]) => string;
}
