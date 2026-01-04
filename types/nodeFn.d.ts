import fs from 'fs';
import crypto from "crypto";
import { PreloadFullFill } from './ipc/enumAndMore.js';
export interface I_WriteFileSyncPerameters {
    path: string;
    data: string;
    encode: fs.WriteFileOptions;
}
export interface I_ReadFileSyncPerameters {
    path: string;
    doCache?: boolean;
    encode: fs.WriteFileOptions;
}
export interface I_ExistsSyncPerameters {
    path: string;
}
export interface I_PathBaseName {
    path: string;
    suffix: string;
}
export interface I_PathRelative {
    from: string;
    to: string;
}
export interface I_ModuleAlice {
    alice: string;
    path: string;
}
export declare class nodeFn {
    static renderer: import("./ipc/IpcRendererHelper.js").IRelativeRendere;
    static fullfill: PreloadFullFill;
    static onReady(callback: () => void): void;
    static crypto: {
        toString: (size: number, encoding?: BufferEncoding) => string;
        randomBytes: (size: number) => Buffer;
        convert: (data: any, from?: crypto.Encoding, to?: crypto.Encoding) => string;
        encrypt: (data: any) => string;
        decrypt: (data: any) => string;
    };
    static url: {
        fileURLToPath: (path: string) => string;
        pathToFileURL: (path: string) => string;
    };
    static resolver: {
        resolve: (importPath: string, importer?: string) => string;
        resolveOut: (importPath: string, importer?: string) => string;
    };
    static path: {
        dirname: (path: string) => string;
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
        isAbsolute: (path: string) => boolean;
        intersectPath: (path1: string, path2: string) => boolean;
        intersectAndReplacePath: (basePath: string, targetPath: string) => boolean;
        ProjectResolve: (path: string, importMetaUrl: string) => string;
    };
    private static readFileSyncStorage;
    private static readFileSyncStorageCounter;
    static fs: {
        openSync: (path: fs.PathLike, flags: fs.OpenMode, mode?: fs.Mode | null, importMetaUrl?: string) => any;
        existsSync: (path: string, importMetaUrl?: string) => boolean;
        rename: (from: string, to: string, importMetaUrl?: string) => any;
        rmSync: (path: fs.PathLike, options?: fs.RmOptions, importMetaUrl?: string) => any;
        isDirectory: (path: fs.PathLike, options?: fs.StatSyncOptions, importMetaUrl?: string) => boolean;
        mkdirSync: (path: string, options: fs.MakeDirectoryOptions, importMetaUrl?: string) => string;
        readFile: (path: string, encode?: import("fs").WriteFileOptions, importMetaUrl?: string) => Promise<any>;
        readFileSync: (path: string, encode?: import("fs").WriteFileOptions, importMetaUrl?: string, doCache?: boolean) => string | null;
        readdirSync: (path: string, encode?: import("fs").WriteFileOptions, importMetaUrl?: string) => string[];
        readdirSyncDirent: (path: string, recursive?: boolean, importMetaUrl?: string) => {
            name: string;
            isDir: boolean;
            isFile: boolean;
        }[];
        writeFileSync: (path: string, data: string, importMetaUrl?: string, encode?: import("fs").WriteFileOptions) => any;
    };
}
