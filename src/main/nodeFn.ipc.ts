import fs from "node:fs";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { fileEntry, FileTypes, RM } from "../resMng/resourceManager.js";

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


    main.On('resource.all', (event) => {
        event.returnValue = RM.getEntriesOfFile();
    });
    main.On('resource.getResource', (event, resKey: string, type: FileTypes, valOrPath: string) => {
        event.returnValue = RM.getResource(resKey, type, valOrPath);
    });
    main.On('resource.setResource', (event, resKey: string, fe: fileEntry) => {
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
}