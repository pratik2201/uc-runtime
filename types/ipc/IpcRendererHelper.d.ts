import { IPC_REGISTER_KEY, IpcRendererCallBack, ProjectRowM } from "./enumAndMore.js";
export interface IRelativeRendere {
    sendSync: (key: string, args: any[]) => any;
    send: (key: string, args: any[]) => void;
    Invoke: (key: string, args: any[]) => Promise<any>;
    on: (chennel: any, callback: IpcRendererCallBack) => void;
    loaded?: (callback: () => void) => void;
    onLoadedCallBack: Array<() => void>;
    isReadyForUse: boolean;
}
export declare class IpcRendererHelper {
    static IPC_ON: {
        [actionKey: string]: IpcRendererCallBack;
    };
    private static loadRelativeChennels;
    static ucConfigList: ProjectRowM[];
    static Group(ukey: string): IRelativeRendere;
    static _Window: Window;
    static init: (_win: Window) => void;
    static onCallback: (event: any, ...args: any[]) => void;
    static sendSync(key: string, args: any[], importMetaUrl?: IPC_REGISTER_KEY): any;
    static send(key: string, args: any[], importMetaUrl?: IPC_REGISTER_KEY): void;
    static On(actionKey: string, callback: IpcRendererCallBack, importMetaUrl?: IPC_REGISTER_KEY): void;
    static Invoke(key: string, args: any[], importMetaUrl: IPC_REGISTER_KEY): Promise<any>;
    static get ucConfig(): ProjectRowM;
    static get importMap(): any;
    static ipcChannels: Set<unknown>;
    static get ipcChennelList(): any;
    static getRelativeURL(_path: string): string;
}
