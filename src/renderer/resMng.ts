// import { IpcRendererHelper } from "ucbuilder/out/renderer/ipc/IpcRendererHelper.js";
// import { FileEntry, FileTypes } from "../main/resMng/resourceManager.js";
// import { RuntimeResource } from "../main/resMng/resourceManagerNew.js";
 
import { FileEntry, FileTypes, RuntimeResource } from "../enumAndMore.js"; 
import { IpcRendererHelper } from "./ipc/IpcRendererHelper.js";

export class Resources {
    static renderer = IpcRendererHelper.Group('ucbuilderdevtools/src/renderer/resMng');

    static register = (res: RuntimeResource) => {
        this.renderer.sendSync('register', [res]);
    }
    static bulkRegister = (list: RuntimeResource[]) => {
        return this.renderer.sendSync('bulkRegister', [list]);
    }
    static has = (key: string) => {
        return this.renderer.sendSync('has', [key]) as boolean;
    }
    static get = (key: string) => {
        return this.renderer.sendSync('get', [key]) as RuntimeResource;
    }
    static getContent = (key: string) => {
        return this.renderer.sendSync('getContent', [key]) as string;
    } 
    static keys = () => {
        return this.renderer.sendSync('keys', []) as string[];
    } 
    static clear = () => {
        this.renderer.sendSync('clear', []);
    }







    static all = () => {
        return this.renderer.sendSync('resource.all', []) as [string, FileEntry][];
    }
    static setResources = (resKey: string, fe: FileEntry) => {
        this.renderer.sendSync('resource.setResource', [resKey, fe]);
    }
    static getResource = (resKey: string, type: FileTypes, valOrPath?: string): string => {
        const res = this.renderer.sendSync('resource.getResource', [resKey, type, valOrPath]) as FileEntry;
        if (res == undefined) {
            console.log(`!!!! AT 'resource.getResource' NO FILE FOUND '${valOrPath}' `);
            return undefined;
        }
        ////console.log(res);
        return res?.value;
    }
    static getValue = (key: string, value: string): string => {
        return this.renderer.sendSync('resource.getValue', [key, value]);
    }
}