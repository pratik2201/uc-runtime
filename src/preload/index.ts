

import { contextBridge, ipcRenderer } from "electron";
import { IpcPreload } from "../main/ipc/IpcPreload.js";
(async () => {
    await IpcPreload.init(contextBridge, ipcRenderer);
})();