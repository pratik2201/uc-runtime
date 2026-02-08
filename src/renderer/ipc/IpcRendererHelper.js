import { IPC_API_KEY, IPC_GET_KEY, UC_ACCESS_KEY } from "../../common/ipc/enumAndMore.js";
import { getCloneableObject } from "ap-shared-core/out/objectUtil.js";
export class IpcRendererHelper {
    static IPC_ON = {};
    static loadRelativeChennels(importMetaUrl) {
        //let ns = IpcRendererHelper.getRelativeURL(importMetaUrl);
        //let s = GetRootPathByUrl_M(ns, this.ucConfigList);
        /*if (typeof window !== "undefined") {

            return IpcRendererHelper.Invoke('loadChennels', [importMetaUrl],UC_ACCESS_KEY);
        }*/
        return undefined;
    }
    //static ucConfigList: ProjectRdowBase[] = [];
    static Group(ukey) {
        if (typeof window === "undefined")
            return;
        let donedanadonerootpath = ukey; //GetRootPathByUrl_M(ukey, this.ucConfigList);  // IpcRendererHelper.getRelativeURL(ukey)
        let rtrn = {
            sendSync(key, args) {
                return IpcRendererHelper.sendSync(key, args, ukey);
            }, send(key, args) {
                return IpcRendererHelper.send(key, args, ukey);
            }, Invoke(key, args) {
                return IpcRendererHelper.Invoke(key, args, ukey);
            }, on(key, callback) {
                return IpcRendererHelper.On(key, callback, ukey);
            }, loaded(callback) {
                if (rtrn.isReadyForUse)
                    callback();
                else
                    rtrn.onLoadedCallBack.push(callback);
            },
            onLoadedCallBack: [],
            isReadyForUse: false
        };
        (async () => {
            let res = await IpcRendererHelper.loadRelativeChennels(ukey);
            if (res == false) {
                rtrn.isReadyForUse = false;
            }
            else {
                rtrn.isReadyForUse = true;
                for (let i = 0, iObj = rtrn.onLoadedCallBack, ilen = iObj.length; i < ilen; i++) {
                    const callback = iObj[i];
                    callback();
                }
            }
        })();
        return rtrn;
    }
    static _Window = undefined;
    static init = (_win) => {
        let cb = window[IPC_API_KEY];
        //this.ucConfigList = this.sendSync('ucConfigList', [], UC_ACCESS_KEY); // cb.sendSync(IPC_API_KEY, 'ucConfigList;');
        cb.on(IPC_API_KEY, this.onCallback);
        //console.log(cb.sendSync(IPC_API_KEY, 'ucConfigList;'));
        console.log('IpcRendererHelper inited..');
    };
    static onCallback = (event, ...args) => {
        let actionKey = args.shift();
        if (actionKey in IpcRendererHelper.IPC_ON) {
            IpcRendererHelper.IPC_ON[actionKey](event, ...args);
        }
        else {
            console.log(`no 'ON EVENT' found [${actionKey}]  in Renderer`);
        }
    };
    static sendSync(key, args, regKey) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[IPC_API_KEY];
        return apk.sendSync(IPC_API_KEY, IPC_GET_KEY(key, regKey), ...args);
        //return WINDOW_API.sendSync(key, args, importMetaUrl, win);
    }
    static send(key, args, regKey) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[IPC_API_KEY];
        return apk.send(IPC_API_KEY, IPC_GET_KEY(key, regKey), ...args);
        //return WINDOW_API.send(key, args, importMetaUrl, win);
    }
    static On(actionKey, callback, regKey) {
        actionKey = IPC_GET_KEY(actionKey, regKey);
        if (!(actionKey in IpcRendererHelper.IPC_ON)) {
            IpcRendererHelper.IPC_ON[actionKey] = callback;
        }
    }
    static Invoke(key, args, importMetaUrl) {
        let win = this._Window ?? window;
        let apk = win[IPC_API_KEY];
        return apk.invoke(IPC_API_KEY, IPC_GET_KEY(key, importMetaUrl), ...args);
    }
    static get assemblies() {
        return this.sendSync('assemblies', [{}], UC_ACCESS_KEY);
    }
    static get ucConfig() {
        return this.sendSync('ucConfig', [{}], UC_ACCESS_KEY);
    }
    // static get importMap() { 
    //     return this.sendSync('impdortMap', [{}], UC_ACCESS_KEY);
    // }
    static ipcChannels = new Set();
    // static get ipcChennelList() {
    //     return this.sendSync('ipcChennelList', [{}],UC_ACCESS_KEY);
    // }
    static getRelativeURL(_path) {
        if (_path.match(/\.ipc\.js$/i) != null)
            return _path;
        return _path.replace(/\.js$/i, ".ipc.js");
    }
}
//# sourceMappingURL=IpcRendererHelper.js.map