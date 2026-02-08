import { BuildResource, ResourceKeyList, ResourceKeyRegistry, ResourceNamedRegistry } from "src/common/resources/enums";
import { IpcRendererHelper } from "./ipc/IpcRendererHelper.js";
export class ResourceManage {
    static renderer = IpcRendererHelper.Group('ucbuilder/src/renderer/ResourceManage');


    static x1 = (res: string) => { return this.renderer.sendSync('x1', [res]); }
    static x0 = (res: string) => { return this.renderer.sendSync('x0', [res]); };


    static register = (res: BuildResource) => {
        this.renderer.sendSync('register', [res]);
    }
    static bulkRegister = (list: BuildResource[]) => {
        return this.renderer.sendSync('bulkRegister', [list]);
    }
    static has = (key: ResourceKeyList) => {
        return this.renderer.sendSync('has', [key]) as boolean;
    }
    /**
     * 
     * @param name 
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static get = <K extends keyof ResourceKeyRegistry>(key: K,CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?:ResourceKeyRegistry[K]) => {
        return this.renderer.sendSync('get', [key]) as BuildResource;
    }
    /**
     * 
     * @param name 
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns 
     */
    static getContent = <K extends keyof ResourceKeyRegistry>(key: K,CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?:ResourceKeyRegistry[K]) => {
        return this.renderer.sendSync('getContent', [key]) as string;
    }

    static keys = () => {
        return this.renderer.sendSync('keys', []) as string[];
    }
    static clear = () => {
        this.renderer.sendSync('clear', []);
    }
    /**
     * 
     * @param name 
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static getByName = <K extends keyof ResourceNamedRegistry>(name: K,CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?:ResourceNamedRegistry[K]) => {
        return this.renderer.sendSync('getByName', [name]) as BuildResource;
    }
    /**
     * 
     * @param name 
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns 
     */
    static getContentByName = <K extends keyof ResourceNamedRegistry>(name: K,CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT?:ResourceNamedRegistry[K]) => {
        return this.renderer.sendSync('getContentByName', [name]) as string;
    }
 
}