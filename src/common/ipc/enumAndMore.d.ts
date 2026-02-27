import { IpcRendererEvent } from "electron";
export declare const UC_ACCESS_KEY = "_____UC____";
export interface ProjectPrimaryAlias {
    alice?: string;
    aliceValue?: string;
    projectPath?: string;
}
export declare class PreloadFullFill {
    url: {
        fileURLToPath: (url: string) => string;
        pathToFileURL: (pth: string) => string;
    };
    path: {
        extname: (path: string) => string;
        isAbsolute: (path: string) => boolean;
        basename: (path: string, suffix?: string) => string;
        relative: (from: string, to: string) => string;
        dirname: (path: string) => string;
        sep: () => string;
        normalize: (path: string) => string;
        join: (...paths: string[]) => string;
        resolve: (...paths: string[]) => string;
    };
}
export type IPC_REGISTER_KEY = string;
export type IpcRendererCallBack = (e: IpcRendererEvent, ...args: any[]) => void;
export interface BridgeAPI {
    fromMain?: (chennel: string, callback: IpcRendererCallBack) => void;
    sendSync?: (chennel: string, ...args: any[]) => any;
    send?: (chennel: string, ...args: any[]) => void;
    invoke?: (chennel: string, ...args: any[]) => Promise<any>;
    on?: (chennel: any, callback: IpcRendererCallBack) => void;
    INIT_IMPORT_MAP?: (_win: Window) => void;
}
export declare function IPC_GET_KEY(actionKey: string, regKey: IPC_REGISTER_KEY): string;
export declare function IPC_SPLIT_KEY(actionKey: string): {
    action: string;
    regKey: string;
};
