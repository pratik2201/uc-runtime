import path, { dirname } from "node:path";
import url, { pathToFileURL } from "node:url";
import fs from "node:fs";
import { PathBridge } from "../build/pathBridge.js";
import { configManage } from "./configManage.js";
import { protocol, type BrowserWindow, type IpcMainEvent } from "electron";
import { getCloneableObject, IPC_API_KEY, IPC_GET_KEY, IPC_REGISTER_KEY } from "./enumAndMore.js";
import { createImportMap, generateImportMap, scanAllProjects } from "./importMapGenerator.js";

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

    static async init(_ipcMain: import("electron").IpcMain/*,  win: import("electron").BrowserWindow, initailModule: string,initialPreload:string*/) {

        // _ipcMain.on(IPC_API_KEY + ';reload-browser-for-developement', (event, args) => {
        //     console.log('reload..callback..');

        //     win.webContents.reloadIgnoringCache();
        //     win.webContents.executeJavaScript(IpcMainHelper.INITIAL_SCRIPT);
        //     event.returnValue = true;
        // });
        _ipcMain.on(IPC_API_KEY, (event, ...args: any[]) => {
            let actionKey = args.shift();
            if (this.IPC_ON.has(actionKey))
                this.IPC_ON.get(actionKey)(event, ...args);
            else {
                //configManage.filler.savePreLoadFilePath(actionKey);
                console.log(`!!! no 'ON EVENT' found [${actionKey}]`);
            }
        });
        _ipcMain.handle(IPC_API_KEY, async (event, ...args: any[]) => {
            let actionKey = args.shift();
            if (this.IPC_HANDLE.has(actionKey))
                return await this.IPC_HANDLE.get(actionKey)(event, ...args);
            else {
                console.log(`no 'HANDLE EVENT' found [${actionKey}]`);
                return undefined;
            }
        });

        await configManage.init();
    }
    static INITIAL_SCRIPT = "";

    static async loadFile(htmlFileFullPath: string, win: BrowserWindow, baseURLForDataURL?: string) {
        // protocol.handle('file', (req,cb) => {
        //     let filePath = decodeURIComponent(req.url.replace("file:///", ""))

        //     if (filePath.endsWith("index.html")) {
        //         let html = fs.readFileSync(filePath, "utf-8")

        //         html = html.replace("<head>", `<head>${importMapScript}`)

        //         cb({ data: Buffer.from(html), mimeType: "text/html" })

        //     }

        //    // cb(filePath);
        //     return cb(filePath);
        // })
        // protocol.interceptFileProtocol("file", (req, cb) => {

        // })
        baseURLForDataURL = baseURLForDataURL ?? htmlFileFullPath;
        let html = fs.readFileSync(htmlFileFullPath, "utf-8");
        let projectDirList = await scanAllProjects();
        const importMap = createImportMap(htmlFileFullPath, projectDirList, dirname(baseURLForDataURL));
        //const importMap = generateImportMap(process.cwd());
        // console.log('process.cwd', process.cwd());

        let mapStr = JSON.stringify(importMap);
        // const mapStr = JSON.stringify(configManage.filler.importmap);
        const importMapScript = `<script type="importmap">${mapStr}</script>`;
        if (/<head>/i.test(html)) {
            html = html.replace(/<head>/i, `<head>${importMapScript}`)
        } else if (/<html[^>]*>/i.test(html)) {
            html = html.replace(/<html[^>]*>/i, `$&\n<head>${importMapScript}</head>`)
        } else {
            html = `${importMapScript}\n${html}`
        }
        const _baseUrlForDataUrl = pathToFileURL(baseURLForDataURL).href;

        console.log('importmapBaseDirectory', _baseUrlForDataUrl);
        win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html), {
            baseURLForDataURL: _baseUrlForDataUrl
        });
    }
}