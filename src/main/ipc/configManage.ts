import path from "node:path";
import url from "node:url";
import { PathBridge } from "../../global/pathBridge.js";
import { ConfigFiller } from "./ConfigFiller.js";
import { correctpath, UC_ACCESS_KEY } from "../../common/ipc/enumAndMore.js";
import { IpcMainHelper } from "./IpcMainHelper.js";
import { IpcRendererHelper } from "../../renderer/ipc/IpcRendererHelper.js";

export class configManage {
    static filler = new ConfigFiller();
    static async init(importMetaPath: string) {
        PathBridge.path = path as any;
        PathBridge.url = url as any;
        if (importMetaPath.startsWith('file:///')) importMetaPath = url.fileURLToPath(importMetaPath);
        const cpth = correctpath(importMetaPath); // path.resolve()
        await this.filler.fill(cpth);
        PathBridge.source = configManage.filler.ucConfigList;
        PathBridge.CheckAndSetDefault();

        IpcMainHelper.On('ucConfig', (event, args: {}) => {
            event.returnValue = this.filler.ucConfig;
        }, UC_ACCESS_KEY);
        IpcMainHelper.On('ucConfigList', (event, args: {}) => {
            event.returnValue = this.filler.ucConfigList;
        }, UC_ACCESS_KEY);
        // IpcMainHelper.On('importMap', (event, args) => {
        //     event.returnValue = this.filler.importmap;
        // }, UC_ACCESS_KEY);
        /*IpcMainHelper.Handle('loadChennels', async (event, ..._paths: []) => {
            // for (let i = 0; i < _paths.length; i++) {
            //     const _path = _paths[i];
            //     try {
            //         await import(`${_path}`);
            //         console.log(`${_path} \nloaded..`);
            //     } catch (ex) {
            //         console.log(ex);
            //         return false;
            //     }
            // }
            return true;
        }, UC_ACCESS_KEY);*/

        // IpcMainHelper.On('ipcChennelList', (event, args: {}) => {
        //     event.returnValue = IpcRendererHelper.ipcChannels;
        // }, UC_ACCESS_KEY);




    }


}
