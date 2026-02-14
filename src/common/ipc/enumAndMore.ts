import { IpcRendererEvent } from "electron";
export const UC_ACCESS_KEY = '_____UC____';
export interface ProjectPrimaryAlias { alice?: string; aliceValue?: string; projectPath?: string; }
export class PreloadFullFill {
    url = {
        fileURLToPath: undefined as (url: string) => string,
        pathToFileURL: undefined as (pth: string) => string,
    };
    path = {
        extname: undefined as (path: string) => string,
        isAbsolute: undefined as (path: string) => boolean,
        basename: undefined as (path: string, suffix?: string) => string,
        relative: undefined as (from: string, to: string) => string,
        dirname: undefined as (path: string) => string,
        sep: undefined as () => string,
        normalize: undefined as (path: string) => string,
        join: undefined as (...paths: string[]) => string,
        resolve: undefined as (...paths: string[]) => string,
    };
}

export type IPC_REGISTER_KEY = string;

export type IpcRendererCallBack = (e: IpcRendererEvent, ...args: any[]) => void;
export interface BridgeAPI {
    fromMain?: (chennel: string, callback: IpcRendererCallBack) => void;
    sendSync?: (chennel: string, ...args: any[]) => any;
    send?: (chennel: string, ...args: any[]) => void;
    invoke?: (chennel: string, ...args: any[]) => Promise<any>;
    on?: (chennel, callback: IpcRendererCallBack) => void;
    INIT_IMPORT_MAP?: (_win: Window) => void;
}
export function IPC_GET_KEY(actionKey: string, regKey: IPC_REGISTER_KEY) {
    return actionKey + ";" + regKey;
}
export function IPC_SPLIT_KEY(actionKey: string): { action: string, regKey: string } {
    let rtrn = actionKey.split(';');
    return { action: rtrn[0], regKey: rtrn[1] };
}