import { basename, dirname, extname, isAbsolute, join, normalize, relative, resolve, sep } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { AssemblyManager } from "../../core-main.js";
export class IpcPreload {
    static IS_INITED = false;
    static init(contextBridge, ipcRenderer) {
        if (IpcPreload.IS_INITED)
            return;
        const fullFill = {
            url: {
                fileURLToPath: (u) => fileURLToPath(u),
                pathToFileURL: (p) => {
                    return pathToFileURL(p).href;
                }
            },
            path: {
                isAbsolute: (path) => isAbsolute(path),
                sep: () => sep,
                basename: (path, suffix) => basename(path, suffix),
                dirname: (path) => dirname(path),
                normalize: (path) => normalize(path),
                relative: (from, to) => relative(from, to),
                join: (...paths) => join(...paths),
                extname: (path) => extname(path),
                resolve: (...paths) => resolve(...paths)
            }
        };
        contextBridge.exposeInMainWorld(AssemblyManager.AKey, {
            //fromMain: (chennel: string, callback: (e: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(chennel, callback),
            sendSync: (chennel, ...args) => ipcRenderer.sendSync(chennel, ...args),
            send: (chennel, ...args) => ipcRenderer.send(chennel, ...args),
            invoke: (chennel, ...args) => ipcRenderer.invoke(chennel, ...args),
            on: (chennel, callback = (event, ...args) => { }) => {
                ipcRenderer.on(chennel, callback);
            },
            fullFill: fullFill,
        });
        contextBridge.exposeInMainWorld("env", {
            NODE_ENV: process.env.NODE_ENV
        });
        console.log('IpcPreload inited..');
        IpcPreload.IS_INITED = true;
    }
}
//# sourceMappingURL=IpcPreload.js.map