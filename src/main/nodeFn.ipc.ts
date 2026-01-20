import fs from "node:fs";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { ResourceType, RM } from "../resMng/resourceManager.js";
import { getRegistry, registerFileSync, registerValue } from "../resMng/resource.dev.js";

export default function () {

    const main = IpcMainGroup('ucbuilder/src/renderer/nodeFn');

    main.On('fs.statSync.isDirectory', (event, path: fs.PathLike, options?: fs.StatSyncOptions) => {
        try {
            event.returnValue = fs.lstatSync(path, options).isDirectory();
        } catch {
            event.returnValue = false;
        }

    });

    main.On('fs.existsSync', (event, path: string) => {
        event.returnValue = fs.existsSync(path);
    });


    main.On('fs.readFileSync', (event, _path, options: (fs.ObjectEncodingOptions & {
        flag?: string | undefined;
    })) => {
        let fileContent: string;
        if (fs.existsSync(_path))
            fileContent = fs.readFileSync(_path, options) as any;
        event.returnValue = fileContent;
    });
    main.On('fs.readFileBase64Sync', (event, _path, options: (fs.ObjectEncodingOptions & {
        flag?: string | undefined;
    })) => {
        if (fs.existsSync(_path))
            event.returnValue = fs.readFileSync(_path, options).toString('base64');
        else event.returnValue = undefined;
    });


    main.On('resource.all', (event, key: string) => {
        event.returnValue = getRegistry()
    }); 
    main.On('resource.getFile', (event, key: string, filePathIfNotExist?: string, type?: ResourceType) => {
        if (RM.has(key)) event.returnValue = RM.get(key);
        else {
            if (filePathIfNotExist != undefined && type != undefined)
                event.returnValue = registerFileSync(key, filePathIfNotExist, type);
            else event.returnValue = undefined;
        };
    });
    main.On('resource.getValue', (event, key: string, valueIfNotExist?: string, type?: ResourceType) => {
        if (RM.has(key)) event.returnValue = RM.get(key);
        else {
            if (valueIfNotExist != undefined && type != undefined)
                event.returnValue = registerValue(key, valueIfNotExist, type);
            else event.returnValue = undefined;
        };
    });
}