import { contextBridge, ipcRenderer } from "electron";
import { IpcPreload } from "../ipc/IpcPreload.js";
(async () => {
    await IpcPreload.init(contextBridge, ipcRenderer);
})();