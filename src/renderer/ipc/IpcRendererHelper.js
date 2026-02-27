import { getCloneableObject } from "ap-shared-core/out/objectUtil.js";
import { IPC_GET_KEY, UC_ACCESS_KEY } from "../../common/ipc/enumAndMore.js";
import { AssemblyManager } from "../Assembly.js";
export class IpcRendererHelper {
    static IPC_ON = {};
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
        return rtrn;
    }
    static _Window = undefined;
    static init = (_win) => {
        let cb = window[AssemblyManager.AKey];
        cb.on(AssemblyManager.AKey, this.onCallback);
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
        let apk = win[AssemblyManager.AKey];
        return apk.sendSync(AssemblyManager.AKey, IPC_GET_KEY(key, regKey), ...args);
        //return WINDOW_API.sendSync(key, args, importMetaUrl, win);
    }
    static send(key, args, regKey) {
        args = getCloneableObject(args);
        let win = this._Window ?? window;
        let apk = win[AssemblyManager.AKey];
        return apk.send(AssemblyManager.AKey, IPC_GET_KEY(key, regKey), ...args);
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
        let apk = win[AssemblyManager.AKey];
        return apk.invoke(AssemblyManager.AKey, IPC_GET_KEY(key, importMetaUrl), ...args);
    }
    static get ipcaccesskey() {
        return this.sendSync('aKey', [{}], UC_ACCESS_KEY);
    }
    static get assemblies() {
        return this.sendSync('assemblies', [{}], UC_ACCESS_KEY);
    }
    static get ucConfig() {
        return this.sendSync('ucConfig', [{}], UC_ACCESS_KEY);
    }
    static ipcChannels = new Set();
}
//# sourceMappingURL=IpcRendererHelper.js.map