import { FileTypes, FileEntry, BuildResource } from "../enumAndMore.js";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { RM } from "./RM.js";
import { ResourceStorage } from "./ResourceStorage.js";
import { decryptResource, encryptResource } from "./cryptoResource.js";
export default function () {
    const main = IpcMainGroup('ucbuilder/src/renderer/ResourceManage');

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

        event.returnValue = ResourceStorage.get(key);
    });
    main.On('getContent', (event, key: string) => {
        event.returnValue = ResourceStorage.getContent(key);
        //let v = ResourceStorage.getContent(key);
        //event.returnValue = getCache(key, v);
    });
    main.On('getByName', (event, name: string) => {
        event.returnValue = ResourceStorage.getByName(name);
        // let v = ResourceStorage.getByName(name);
        // if (v != undefined) {
        //     v = JSON.parse(JSON.stringify(v));
        //     v.content = getCache(name, v.content);
        // }
        // event.returnValue = v;
    });
    main.On('getContentByName', (event, name: string) => {
        //let v = ResourceStorage.getContentByName(name);
        event.returnValue = ResourceStorage.getContentByName(name);//getCache(name, v);
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