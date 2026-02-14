import { ContextBridge, IpcRenderer } from "electron";
export declare class IpcPreload {
    private static IS_INITED;
    static init(contextBridge: ContextBridge, ipcRenderer: IpcRenderer): void;
}
