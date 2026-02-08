import fs from 'fs';
import { PreloadFullFill } from "../common/ipc/enumAndMore.js";
export declare class nodeFn {
    static renderer: import("./ipc/IpcRendererHelper.js").IRelativeRendere;
    private static readFileSyncStorage;
    static fullfill: PreloadFullFill;
    static url: {
        fileURLToPath: (path: string) => string;
        pathToFileURL: (path: string) => string;
    };
    static path: {
        startsWith: (thisPath: string, startWithThisPath: string) => boolean;
        readonly sep: any;
        extname: (path: string) => string;
        dirname: (path: string) => string;
        isAbsolute: (path: string) => boolean;
        basename: (path: string, suffix?: string) => string;
        relative: (from: string, to: string) => string;
        resolve: (...paths: string[]) => string;
        resolveFilePath: (fromFilePath: string, toFilePath: string) => string;
        relativeFilePath: (fromFilePath: string, path: string) => string;
        getPathOnly: (pth: string) => string;
        getUrlOnly: (pth: string) => string;
        subtractPath: (basePath: string, targetPath: string) => string;
        isSamePath: (path1: string, path2: string) => boolean;
        join: (...paths: string[]) => string;
        normalize: (path: string) => string;
    };
    static fs: {
        isDirectory: (path: fs.PathLike, options?: fs.StatSyncOptions) => boolean;
        existsSync: (path: string) => boolean;
        readFileSync: (path: string, encode?: import("fs").WriteFileOptions, doCache?: boolean) => string | null;
        readFileBufferSync: (path: string) => Uint8Array<any>;
    };
}
