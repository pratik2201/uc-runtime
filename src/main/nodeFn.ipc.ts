import fs from "node:fs";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";

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


}