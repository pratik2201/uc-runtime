import path, { dirname, resolve } from "node:path";
import url, { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import { PathBridge } from "../../global/pathBridge.js";
import { configManage } from "./configManage.js";
import { protocol, type BrowserWindow, type IpcMainEvent } from "electron";
import { correctpath, getCloneableObject, IPC_API_KEY, IPC_GET_KEY, IPC_REGISTER_KEY } from "../../common/ipc/enumAndMore.js";
import { createImportMap, generateImportMap, scanAllProjects } from "./importMapGenerator.js";  // ucbuilder/out/main/devtoolsBridge.js
import { app, ipcMain } from "electron";

type IpcMainCallBack = (e: import("electron").IpcMainEvent, ...args: any[]) => void;
type IpcMainInvokeCallBack = (e: import("electron").IpcMainInvokeEvent, ...args: any[]) => Promise<any>;

interface IGroupMain {
    On: (actionKey: string, callback: IpcMainCallBack) => void,
    Handle: (actionKey: string, callback: IpcMainInvokeCallBack) => void,
    Send: (actionKey: string, evt: IpcMainEvent, ...args: any[]) => void,
    Reply: (actionKey: string, evt: IpcMainEvent, ...args: any[]) => void,
}

export function IpcMainGroup(regKey: string): IGroupMain {
    if (typeof window !== "undefined") return;
    PathBridge.path = path as any;
    PathBridge.url = url as any;

    let urlObj = regKey;// GetRootPathByUrl_M(urlpath, configManage.filler.ucConfigList);
    let rtrn: IGroupMain = {
        On: (key, callback) => {
            return IpcMainHelper.On(key, callback, urlObj);
        },
        Handle: (key, callback) => {
            return IpcMainHelper.Handle(key, callback, urlObj);
        },
        Send: (key, evt: IpcMainEvent, ...args: any[]) => {
            IpcMainHelper.Send(key, evt, args, urlObj);
            //evt.sender.send(key, callback, urlPath);
        },
        Reply: (key, evt: IpcMainEvent, ...args: any[]) => {


            IpcMainHelper.Reply(key, evt, args/*[...args]*/, urlObj);
            //evt.sender.send(key, callback, urlPath);
        }
    };
    return rtrn;
}
export class IpcMainHelper {
    static Send(actionKey: string, evt: IpcMainEvent, args: any[], importMetaUrl: IPC_REGISTER_KEY = "") {
        args = getCloneableObject(args);
        //args.forEach(s => s = getCloneableObject(s));
        evt.sender.send(IPC_API_KEY, IPC_GET_KEY(actionKey, importMetaUrl), ...args);
    }
    static Reply(actionKey: string, evt: IpcMainEvent, args: any[], importMetaUrl: IPC_REGISTER_KEY = "") {
        //console.log(...args);

        args = getCloneableObject(args);
        //args.forEach(s => s = getCloneableObject(s));
        evt.reply(IPC_API_KEY, IPC_GET_KEY(actionKey, importMetaUrl), ...args);
    }
    static IPC_ON = new Map<string, IpcMainCallBack>(); //{ [actionKey: string]: IpcMainCallBack } = {};
    static IPC_HANDLE = new Map<string, IpcMainInvokeCallBack>(); // { [actionKey: string]: IpcMainInvokeCallBack } = {};
    static On(actionKey: string, callback: IpcMainCallBack, importMetaUrl: IPC_REGISTER_KEY = "") {
        actionKey = IPC_GET_KEY(actionKey, importMetaUrl);
        if (!this.IPC_ON.has(actionKey))
            this.IPC_ON.set(actionKey, callback);
    }
    static Handle(actionKey: string, callback: IpcMainInvokeCallBack, importMetaUrl: IPC_REGISTER_KEY = "") {
        actionKey = IPC_GET_KEY(actionKey, importMetaUrl);
        if (!this.IPC_HANDLE.has(actionKey))
            this.IPC_HANDLE.set(actionKey, callback);
    }

    static async init(importMetaPath: string/*_ipcMain: import("electron").IpcMain*/) {

        ipcMain.on(IPC_API_KEY, (event, ...args: any[]) => {
            let actionKey = args.shift();
            if (this.IPC_ON.has(actionKey))
                this.IPC_ON.get(actionKey)(event, ...args);
            else {
                //configManage.filler.savePreLoadFilePath(actionKey);
                console.log(`!!! no 'ON EVENT' found [${actionKey}]`);
            }
        });
        ipcMain.handle(IPC_API_KEY, async (event, ...args: any[]) => {
            let actionKey = args.shift();
            if (this.IPC_HANDLE.has(actionKey))
                return await this.IPC_HANDLE.get(actionKey)(event, ...args);
            else {
                console.log(`no 'HANDLE EVENT' found [${actionKey}]`);
                return undefined;
            }
        });
        await configManage.init(importMetaPath);
        (await import('../nodeFn.ipc.js')).default();
        (await import('../ResourceManage.ipc.js')).default();
        if (!app.isPackaged) {
            try {
                const { initDevTools } = await import("ucbuilder-devtools/out/main/index.js");
                if (initDevTools) {
                    await initDevTools();
                }
            } catch (err) {
                // Devtools not installed or failed to load
                console.warn("ucbuilder: devtools not available.");
            }
        }
        // (await import('../../build/fileWatcher.ipc.js')).default();
        // if (configManage.filler.MAIN_CONFIG.config.env == 'developer') {
        //     (await import('../../build/buildTimeFn.ipc.js')).default();
        // }
        console.log('configManage inited.');
    }
    static INITIAL_SCRIPT = "";

    static async loadURL(_path: string, win: BrowserWindow, options?: Electron.LoadURLOptions) {
        let htmlUrl: string, htmlPath: string;
        if (_path.startsWith('file:///')) {
            htmlUrl = _path;
            htmlPath = fileURLToPath(_path);
        } else {
            htmlUrl = pathToFileURL(_path).href;
            htmlPath = _path;
        }
        const baseURLForDataURL = options?.baseURLForDataURL ?? htmlUrl;
        let html = fs.readFileSync(htmlPath, "utf-8");
        let projectDirList = await scanAllProjects();
        const importMap = createImportMap(_path, projectDirList, dirname(baseURLForDataURL));

        let mapStr = JSON.stringify(importMap);
        //const modulePath = correctpath(resolve(dirname(fileURLToPath(import.meta.url)), '../../renderer/ipc/ShubhLabh.js'));
        const importMapScript = `<script type="importmap">${mapStr}</script>`;
        //<script type="module" src="${modulePath}"></script>
        const headRegex = /<head\b[^>]*>/i;
        const htmlRegex = /<html\b[^>]*>/i;

        if (headRegex.test(html)) {
            html = html.replace(headRegex, match => match + importMapScript);
        }
        else if (htmlRegex.test(html)) {
            html = html.replace(htmlRegex, match => `${match}\n<head>${importMapScript}</head>`);
        }
        else {
            html = `${importMapScript}\n${html}`;
        }

        win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html), options);
    }

} 