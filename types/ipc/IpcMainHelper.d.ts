import type { IpcMainEvent } from "electron";
import { IPC_REGISTER_KEY } from "./enumAndMore.js";
type IpcMainCallBack = (e: import("electron").IpcMainEvent, ...args: any[]) => void;
type IpcMainInvokeCallBack = (e: import("electron").IpcMainInvokeEvent, ...args: any[]) => Promise<any>;
interface IGroupMain {
    On: (actionKey: string, callback: IpcMainCallBack) => void;
    Handle: (actionKey: string, callback: IpcMainInvokeCallBack) => void;
    Send: (actionKey: string, evt: IpcMainEvent, ...args: any[]) => void;
    Reply: (actionKey: string, evt: IpcMainEvent, ...args: any[]) => void;
}
export declare function IpcMainGroup(regKey: string): IGroupMain;
export declare class IpcMainHelper {
    static Send(actionKey: string, evt: IpcMainEvent, args: any[], importMetaUrl?: IPC_REGISTER_KEY): void;
    static Reply(actionKey: string, evt: IpcMainEvent, args: any[], importMetaUrl?: IPC_REGISTER_KEY): void;
    static IPC_ON: Map<string, IpcMainCallBack>;
    static IPC_HANDLE: Map<string, IpcMainInvokeCallBack>;
    static On(actionKey: string, callback: IpcMainCallBack, importMetaUrl?: IPC_REGISTER_KEY): void;
    static Handle(actionKey: string, callback: IpcMainInvokeCallBack, importMetaUrl?: IPC_REGISTER_KEY): void;
    static init(_ipcMain: import("electron").IpcMain): void;
    static INITIAL_SCRIPT: string;
}
export {};
