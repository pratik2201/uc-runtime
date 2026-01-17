import { BridgeAPI, getCloneableObject, IPC_API_KEY, IPC_GET_KEY, IPC_REGISTER_KEY, IpcRendererCallBack, ProjectRowBase,   UC_ACCESS_KEY } from "../../common/ipc/enumAndMore.js";
export interface IRelativeRendere {
    sendSync: (key: string, args: any[]) => any;
    send: (key: string, args: any[]) => void;
    Invoke: (key: string, args: any[]) => Promise<any>;
    on: (chennel, callback: IpcRendererCallBack) => void;
    loaded?: (callback: () => void) => void;
    onLoadedCallBack: Array<() => void>;
    isReadyForUse: boolean;
}
export class  IpcRendererHelper {

    static IPC_ON: { [actionKey: string]: IpcRendererCallBack } = {};
    private static loadRelativeChennels(importMetaUrl: string): Promise<any> {
        //let ns = IpcRendererHelper.getRelativeURL(importMetaUrl);
        //let s = GetRootPathByUrl_M(ns, this.ucConfigList);
        /*if (typeof window !== "undefined") {

            return IpcRendererHelper.Invoke('loadChennels', [importMetaUrl],UC_ACCESS_KEY);
        }*/
        return undefined;
    }
    static ucConfigList: ProjectRowBase[] = [];
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
        (async () => {
            let res = await IpcRendererHelper.loadRelativeChennels(ukey);
            if (res == false) {
                rtrn.isReadyForUse = false;
            } else {
                rtrn.isReadyForUse = true;
                for (let i = 0, iObj = rtrn.onLoadedCallBack, ilen = iObj.length; i < ilen; i++) {
                    const callback = iObj[i];
                    callback();
                }
            }
        })();
        return rtrn;
    }
    static _Window: Window = undefined;
    static init = (_win: Window) => {
        let cb = window[IPC_API_KEY] as BridgeAPI;
        this.ucConfigList = this.sendSync('ucConfigList',[],UC_ACCESS_KEY); // cb.sendSync(IPC_API_KEY, 'ucConfigList;');
        cb.on(IPC_API_KEY, this.onCallback);
        //console.log(cb.sendSync(IPC_API_KEY, 'ucConfigList;'));

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
        let apk = win[IPC_API_KEY] as BridgeAPI;
        return apk.sendSync(IPC_API_KEY, IPC_GET_KEY(key, regKey), ...args);

        //return WINDOW_API.sendSync(key, args, importMetaUrl, win);
    }
    static send(key: string, args: any[], regKey?: IPC_REGISTER_KEY) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[IPC_API_KEY] as BridgeAPI;
        return apk.send(IPC_API_KEY, IPC_GET_KEY(key, regKey), ...args);

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
        let apk = win[IPC_API_KEY] as BridgeAPI;

        return apk.invoke(IPC_API_KEY, IPC_GET_KEY(key, importMetaUrl), ...args);
    }

    static get ucConfig(): ProjectRowBase {
        return this.sendSync('ucConfig', [{}],UC_ACCESS_KEY);
    }
    static get importMap() {

        return this.sendSync('importMap', [{}],UC_ACCESS_KEY);
    }
    static ipcChannels = new Set();
    // static get ipcChennelList() {
    //     return this.sendSync('ipcChennelList', [{}],UC_ACCESS_KEY);
    // }
    static getRelativeURL(_path: string) {
        if (_path.match(/\.ipc\.js$/i) != null) return _path;
        return _path.replace(/\.js$/i, ".ipc.js");
    }
}