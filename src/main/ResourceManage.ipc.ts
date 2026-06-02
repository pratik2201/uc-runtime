
 import { BuildResource, ResourceNamedRegistry } from "ap-shared-core/core-common.js"; 
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { ResourceStorage } from "./ResourceStorage.js"; 
import { encryptResource, decryptResource } from "ap-shared-core/core-main.js";

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
    });
    main.On('getByName', (event, name) => {
        event.returnValue = ResourceStorage.getByName(name as never); 
    });
    main.On('getContentByName', (event, name) => { 
        event.returnValue = ResourceStorage.getContentByName(name as never); 
    });
    main.On('keys', (event) => {
        event.returnValue = ResourceStorage.keys();
    });
    main.On('clear', (event) => {
        event.returnValue = ResourceStorage.clear();
    });
};