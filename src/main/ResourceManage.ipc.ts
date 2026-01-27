import { FileTypes, FileEntry, BuildResource } from "../enumAndMore.js";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { RM } from "./RM.js";
import { ResourceStorage } from "./ResourceStorage.js";
import { decryptResource, encryptResource } from "./cryptoResource.js";


export default function () {

    const main = IpcMainGroup('ucbuilderdevtools/src/renderer/resMng');
    const cache = new Map<string, string>();
    function getCache(key: string, content: string) {
        if (cache.has(key)) return cache.get(key);
        else {
            if (content == undefined) return undefined;
            const v = decryptResource(content);
            cache.set(key, v);
            return v;
        }
    }
    main.On('x1', (event, res: string) => {
        event.returnValue = encryptResource(res);
    });
    main.On('x0', (event, res: string) => {
        event.returnValue = decryptResource(res);

    });

    main.On('register', (event, res: BuildResource) => {
        event.returnValue = ResourceStorage.register(res);
    });
    main.On('bulkRegister', (event, list: BuildResource[]) => {
        event.returnValue = ResourceStorage.bulkRegister(list);
    });
    main.On('has', (event, key: string) => {
        event.returnValue = ResourceStorage.has(key);
    });
    main.On('get', (event, key: string) => {
        let v = ResourceStorage.get(key);
        if (v != undefined) {
            v = JSON.parse(JSON.stringify(v));
            v.content = getCache(key,v.content);
        }
        event.returnValue = v;
    });
    main.On('getContent', (event, key: string) => {
        let v = ResourceStorage.getContent(key);
        event.returnValue = getCache(key, v);
    });
    main.On('keys', (event) => {
        event.returnValue = ResourceStorage.keys();
    });
    main.On('clear', (event) => {
        event.returnValue = ResourceStorage.clear();
    });


    main.On('resource.all', (event) => {
        event.returnValue = RM.getEntriesOfFile();
    });
    main.On('resource.getResource', (event, resKey: string, type: FileTypes, valOrPath: string) => {
        event.returnValue = RM.getResource(resKey, type, valOrPath);
    });
    main.On('resource.setResource', (event, resKey: string, fe: FileEntry) => {
        RM.setResource(resKey, fe);
        event.returnValue = undefined;
    });
    // main.On('resource.getValue', (event, key: string, valueIfNotExist?: string, type?: FileTypes) => {
    //     if (RM.hasValue(key)) event.returnValue = RM.getValue(key);
    //     else {
    //         if (valueIfNotExist != undefined && type != undefined)
    //             event.returnValue = registerValue(key, valueIfNotExist, type);
    //         else event.returnValue = undefined;
    //     };
    // });
};