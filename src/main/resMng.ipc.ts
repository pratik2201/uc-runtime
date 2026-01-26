import { RuntimeResource, FileTypes, FileEntry } from "../enumAndMore.js";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { RM } from "./resourceManager.js";
import {  ResourceManagerNew } from "./resourceManagerNew.js";


export default function () {

    const main = IpcMainGroup('ucbuilderdevtools/src/renderer/resMng');

    main.On('register', (event, res: RuntimeResource) => {
        event.returnValue = ResourceManagerNew.register(res);
    });
    main.On('bulkRegister', (event, list: RuntimeResource[]) => {
        event.returnValue = ResourceManagerNew.bulkRegister(list);
    });
    main.On('has', (event,key: string) => {
        event.returnValue = ResourceManagerNew.has(key);  
    });
    main.On('get', (event,key: string) => {
        event.returnValue  = ResourceManagerNew.get(key); 
    });
    main.On('getContent', (event,key: string) => {
        event.returnValue  = ResourceManagerNew.getContent(key);  
    });
    main.On('keys', (event) => {
        event.returnValue  = ResourceManagerNew.keys(); 
    });
    main.On('clear', (event) => {
        event.returnValue = ResourceManagerNew.clear();
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