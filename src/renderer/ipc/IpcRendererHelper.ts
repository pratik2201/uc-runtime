import { getCloneableObject } from "ap-shared-core/out/objectUtil.js";
import { ProjectRowBase } from "ap-shared-core/out/uc-runtime/configResources.js";
import { BridgeAPI, IPC_GET_KEY, IPC_REGISTER_KEY, IpcRendererCallBack, UC_ACCESS_KEY } from "../../common/ipc/enumAndMore.js";
import { AssemblyManager } from "../Assembly.js";
 
export interface IRelativeRendere {
    sendSync: (key: string, args: any[]) => any;
    send: (key: string, args: any[]) => void;
    Invoke: (key: string, args: any[]) => Promise<any>;
    on: (chennel, callback: IpcRendererCallBack) => void;
    loaded?: (callback: () => void) => void;
    onLoadedCallBack: Array<() => void>;
    isReadyForUse: boolean;
}
export class IpcRendererHelper {

    static IPC_ON: { [actionKey: string]: IpcRendererCallBack } = {};
    
     //static ucConfigList: ProjectRdowBase[] = [];
    static Group(ukey: string) { // donedanadonerootpath
        if (typeof window === "undefined") return;
        let donedanadonerootpath = ukey; //GetRootPathByUrl_M(ukey, this.ucConfigList);  // IpcRendererHelper.getRelativeURL(ukey)
        let rtrn: IRelativeRendere = {
            sendSync(key, args) {
                return IpcRendererHelper.sendSync(key, args, ukey);
            }, send(key, args) {
                return IpcRendererHelper.send(key, args, ukey);
            }, Invoke(key, args) {
                return IpcRendererHelper.Invoke(key, args, ukey);
            }, on(key, callback: IpcRendererCallBack) {
                return IpcRendererHelper.On(key, callback, ukey);
            }, loaded(callback: () => void) {
                if (rtrn.isReadyForUse) callback();
                else rtrn.onLoadedCallBack.push(callback);
            },
            onLoadedCallBack: [],
            isReadyForUse: false
        }; 
        return rtrn;
    }
    static _Window: Window = undefined;
    static init = (_win: Window) => {
        let cb = window[AssemblyManager.AKey] as BridgeAPI;
        cb.on(AssemblyManager.AKey, this.onCallback);
        console.log('IpcRendererHelper inited..');
    }
    static onCallback = (event, ...args: any[]) => {
        let actionKey = args.shift();
        if (actionKey in IpcRendererHelper.IPC_ON) {
            IpcRendererHelper.IPC_ON[actionKey](event, ...args);
        } else {
            console.log(`no 'ON EVENT' found [${actionKey}]  in Renderer`);
        }
    }
    static sendSync(key: string, args: any[], regKey?: IPC_REGISTER_KEY) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[AssemblyManager.AKey] as BridgeAPI;
        return apk.sendSync(AssemblyManager.AKey, IPC_GET_KEY(key, regKey), ...args);

        //return WINDOW_API.sendSync(key, args, importMetaUrl, win);
    }
    static send(key: string, args: any[], regKey?: IPC_REGISTER_KEY) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[AssemblyManager.AKey] as BridgeAPI;
        return apk.send(AssemblyManager.AKey, IPC_GET_KEY(key, regKey), ...args);

        //return WINDOW_API.send(key, args, importMetaUrl, win);

    }

    static On(actionKey: string, callback: IpcRendererCallBack, regKey?: IPC_REGISTER_KEY) {
        actionKey = IPC_GET_KEY(actionKey, regKey);
        if (!(actionKey in IpcRendererHelper.IPC_ON)) {
            IpcRendererHelper.IPC_ON[actionKey] = callback;
        }
    }
    static Invoke(key: string, args: any[], importMetaUrl: IPC_REGISTER_KEY) {
        let win = this._Window ?? window;
        let apk = win[AssemblyManager.AKey] as BridgeAPI;

        return apk.invoke(AssemblyManager.AKey, IPC_GET_KEY(key, importMetaUrl), ...args);
    }
    static get ipcaccesskey(): string {
        return this.sendSync('aKey', [{}], UC_ACCESS_KEY);
    }
     
    static get assemblies(): ProjectRowBase {
        return this.sendSync('assemblies', [{}], UC_ACCESS_KEY);
    }
    static get ucConfig(): ProjectRowBase {
        return this.sendSync('ucConfig', [{}], UC_ACCESS_KEY);
    } 
    static ipcChannels = new Set();     
}