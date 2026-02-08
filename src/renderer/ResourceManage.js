import { IpcRendererHelper } from "./ipc/IpcRendererHelper.js";
export class ResourceManage {
    static renderer = IpcRendererHelper.Group('ucbuilder/src/renderer/ResourceManage');
    static x1 = (res) => { return this.renderer.sendSync('x1', [res]); };
    static x0 = (res) => { return this.renderer.sendSync('x0', [res]); };
    static register = (res) => {
        this.renderer.sendSync('register', [res]);
    };
    static bulkRegister = (list) => {
        return this.renderer.sendSync('bulkRegister', [list]);
    };
    static has = (key) => {
        return this.renderer.sendSync('has', [key]);
    };
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static get = (key, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT) => {
        return this.renderer.sendSync('get', [key]);
    };
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns
     */
    static getContent = (key, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT) => {
        return this.renderer.sendSync('getContent', [key]);
    };
    static keys = () => {
        return this.renderer.sendSync('keys', []);
    };
    static clear = () => {
        this.renderer.sendSync('clear', []);
    };
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns {BuildResource}
     */
    static getByName = (name, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT) => {
        return this.renderer.sendSync('getByName', [name]);
    };
    /**
     *
     * @param name
     * @param CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT this is for check the alias path is correct (in case other resource already bound this alias)
     * @returns
     */
    static getContentByName = (name, CHECK_RESOURCE_PATH_IS_CORRECT_OR_NOT) => {
        return this.renderer.sendSync('getContentByName', [name]);
    };
}
//# sourceMappingURL=ResourceManage.js.map