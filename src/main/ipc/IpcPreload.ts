import { ContextBridge, IpcRenderer, IpcRendererEvent } from "electron";
import { basename, dirname, join, normalize, relative, resolve, isAbsolute } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { BridgeAPI, IPC_API_KEY } from "../../common/ipc/enumAndMore.js";
export class IpcPreload {
    private static IS_INITED = false;
    static init(contextBridge: ContextBridge, ipcRenderer: IpcRenderer) {

        if (IpcPreload.IS_INITED) return;
        const fullFill = {
            url: {
                fileURLToPath: (u) => fileURLToPath(u),
                pathToFileURL: (p) => {
                    return pathToFileURL(p).href;
                }
            },
            path: {
                isAbsolute: (path) => isAbsolute(path),
                basename: (path, suffix) => basename(path, suffix),
                dirname: (path) => dirname(path),
                normalize: (path) => normalize(path),
                relative: (from, to) => relative(from, to),
                join: (...paths) => join(...paths),
                resolve: (...paths) => resolve(...paths)
            }
        };
        contextBridge.exposeInMainWorld(IPC_API_KEY, {
            //fromMain: (chennel: string, callback: (e: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(chennel, callback),
            sendSync: (chennel: string, ...args: any[]) => ipcRenderer.sendSync(chennel, ...args),
            send: (chennel: string, ...args: any[]) => ipcRenderer.send(chennel, ...args),
            invoke: (chennel: string, ...args: any[]): Promise<any> => ipcRenderer.invoke(chennel, ...args),
            on: (chennel, callback = (event: IpcRendererEvent, ...args: any[]) => { }) => {
                ipcRenderer.on(chennel, callback);
            },
            fullFill: fullFill, 
        } as BridgeAPI);
        contextBridge.exposeInMainWorld("env", {
            NODE_ENV: process.env.NODE_ENV
        });
        console.log('IpcPreload inited..');         
        IpcPreload.IS_INITED = true;
    }

}