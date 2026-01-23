import fs from 'fs';
import { PreloadFullFill } from "../common/ipc/enumAndMore.js";
import { ucUtil } from "../global/ucUtil.js";
import { IpcRendererHelper } from './ipc/IpcRendererHelper.js';
import { fileEntry, FileTypes } from '../resMng/resourceManager.js';
// export interface I_WriteFileSyncPerameters { path: string, data: string, encode: fs.WriteFileOptions }
// export interface I_ReadFileSyncPerameters { path: string, doCache?: boolean, encode: fs.WriteFileOptions }
// export interface I_ExistsSyncPerameters { path: string, }
// export interface I_PathBaseName { path: string, suffix: string }
// export interface I_PathRelative { from: string, to: string }
// export interface I_ModuleAlice { alice: string, path: string }

export class nodeFn {
    static renderer = IpcRendererHelper.Group('ucbuilder/src/renderer/nodeFn');

    // static fullfill: PreloadFullFill = undefined;
    // static onReady(callback: () => void) {
    //     this.renderer.loaded(callback);
    // }

    // static crypto = {
    //     toString: (size: number, encoding?: BufferEncoding): string => {
    //         return this.renderer.sendSync('crypto.toString', [size, encoding]);
    //     },
    //     randomBytes: (size: number): Buffer => {
    //         return this.renderer.sendSync('crypto.randomBytes', [size]);
    //     },
    //     convert: (data: any, from: crypto.Encoding = "utf-8", to: crypto.Encoding = "hex"): string => {
    //         return this.renderer.sendSync('crypto.convert', [data, from, to]);
    //     },
    //     encrypt: (data: any): string => {
    //         return this.crypto.convert(data, 'utf8', 'hex');
    //     },
    //     decrypt: (data: any): string => {
    //         return this.crypto.convert(data, 'hex', 'utf8');
    //     }
    // }



    // static url = {
    //     fileURLToPath: (path: string): string => {
    //         if (!path.startsWith('file:')) return path;
    //         return nodeFn.fullfill.url.fileURLToPath(path);
    //         //return renderer.sendSync('url.fileURLToPath', [path]) as string;

    //     }, pathToFileURL: (path: string): string => {
    //         if (path.startsWith('file:')) return path;
    //         return nodeFn.fullfill.url.pathToFileURL(path);
    //         //return renderer.sendSync('url.pathToFileURL', [path]) as string;
    //     },
    // }
    /* static resolver = {
         resolve: (importPath: string, importer?: string): string => {
             return this.renderer.sendSync('resolver.resolve', [importPath, importer]);
         },
         resolveOut: (importPath: string, importer?: string): string => {
             return this.renderer.sendSync('resolver.resolveOut', [importPath, importer]);
         }
     }*/
    // static path = {
    //     startsWith: (thisPath: string, startWithThisPath: string) => {
    //         const base = nodeExp.path.resolve(startWithThisPath).toLowerCase();
    //         const target = nodeExp.path.resolve(thisPath).toLowerCase(); 
    //         const relative = nodeExp.path.relative(base, target);
    //         return relative && !relative.startsWith("..") && !nodeExp.path.isAbsolute(relative);
    //     },
    //     dirname: (path: string): string => {
    //         return this.fullfill.path.dirname(path); 
    //     },
    //     isAbsolute: (path: string) => {
    //         return this.fullfill.path.isAbsolute(path); 
    //     },
    //     basename: (path: string, suffix?: string): string => {
    //         return nodeFn.fullfill.path.basename(path, suffix);
    //     },
    //     relative: (from: string, to: string): string => {
    //         return this.fullfill.path.relative(from, to);
    //     },
    //     resolve: (...paths: string[]): string => {
    //         return nodeFn.fullfill.path.resolve(...paths);
    //     },

    //     resolveFilePath: (fromFilePath: string, toFilePath: string): string => {
    //         let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
    //         let fspath = ucUtil.toFilePath(this.fullfill.path.resolve(ius, toFilePath));
    //         return fspath;
    //     },
    //     relativeFilePath: (fromFilePath: string, path: string): string => {
    //         path = ucUtil.devEsc(path);
    //         let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
    //         let fspath = ucUtil.toFilePath(this.fullfill.path.relative(ius, path));
    //         return fspath;
    //     },
    //     getPathOnly: (pth: string) => {
    //         return pth.startsWith('file:') ? this.fullfill.url.fileURLToPath(pth) : pth;
    //     },
    //     getUrlOnly: (pth: string) => {
    //         return pth.startsWith('file:') ? pth : this.fullfill.url.pathToFileURL(pth);
    //     },
    //     subtractPath: (basePath: string, targetPath: string): string => {
    //         const absBase = this.fullfill.path.resolve(basePath);
    //         const absTarget = this.fullfill.path.resolve(targetPath);
    //         const relative = this.fullfill.path.relative(absBase, absTarget);
    //         return relative;
    //     },
    //     isSamePath: (path1: string, path2: string) => {
    //         const absA = nodeExp.path.resolve(path1);
    //         const absB = nodeExp.path.resolve(path2);
    //         return (nodeExp.path.normalize(absA) === nodeExp.path.normalize(absB));
    //     },

    //     join: (...paths: string[]): string => {
    //         return nodeFn.fullfill.path.join(...paths);
    //     },
    //     normalize: (path: string): string => {
    //         return nodeFn.fullfill.path.normalize(path);
    //     },
    //     // intersectPath: (path1: string, path2: string): boolean => {
    //     //     return this.renderer.sendSync('path.intersectPath', [path1, path2]);
    //     // },
    //     // intersectAndReplacePath: (basePath: string, targetPath: string): boolean => {
    //     //     return this.renderer.sendSync('path.intersectAndReplacePath', [basePath, targetPath]);
    //     // },
    // }
    private static readFileSyncStorage = new Map<string, string>();
    //private static readFileSyncStorageCounter = 0;
    static fullfill: PreloadFullFill = undefined;
    static url = {
        fileURLToPath: (path: string): string => {
            if (!path.startsWith('file:')) return path;
            return nodeFn.fullfill.url.fileURLToPath(path);
            //return renderer.sendSync('url.fileURLToPath', [path]) as string;

        }, pathToFileURL: (path: string): string => {
            if (path.startsWith('file:')) return path;
            return nodeFn.fullfill.url.pathToFileURL(path);
            //return renderer.sendSync('url.pathToFileURL', [path]) as string;
        },
    }
    static path = {
        startsWith: (thisPath: string, startWithThisPath: string) => {
            const base = nodeFn.path.resolve(startWithThisPath).toLowerCase();
            const target = nodeFn.path.resolve(thisPath).toLowerCase();
            const relative = nodeFn.path.relative(base, target);
            return relative && !relative.startsWith("..") && !nodeFn.path.isAbsolute(relative);
        },
        dirname: (path: string): string => {
            return this.fullfill.path.dirname(path);
        },
        isAbsolute: (path: string) => {
            return this.fullfill.path.isAbsolute(path);
        },
        basename: (path: string, suffix?: string): string => {
            return nodeFn.fullfill.path.basename(path, suffix);
        },
        relative: (from: string, to: string): string => {
            return this.fullfill.path.relative(from, to);
        },
        resolve: (...paths: string[]): string => {
            return nodeFn.fullfill.path.resolve(...paths);
        },

        resolveFilePath: (fromFilePath: string, toFilePath: string): string => {
            let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
            let fspath = ucUtil.toFilePath(this.fullfill.path.resolve(ius, toFilePath));
            return fspath;
        },
        relativeFilePath: (fromFilePath: string, path: string): string => {
            path = ucUtil.devEsc(path);
            let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
            let fspath = ucUtil.toFilePath(this.fullfill.path.relative(ius, path));
            return fspath;
        },
        getPathOnly: (pth: string) => {
            return pth.startsWith('file:') ? this.fullfill.url.fileURLToPath(pth) : pth;
        },
        getUrlOnly: (pth: string) => {
            return pth.startsWith('file:') ? pth : this.fullfill.url.pathToFileURL(pth);
        },
        subtractPath: (basePath: string, targetPath: string): string => {
            const absBase = this.fullfill.path.resolve(basePath);
            const absTarget = this.fullfill.path.resolve(targetPath);
            const relative = this.fullfill.path.relative(absBase, absTarget);
            return relative;
        },
        isSamePath: (path1: string, path2: string) => {
            const absA = nodeFn.path.resolve(path1);
            const absB = nodeFn.path.resolve(path2);
            return (nodeFn.path.normalize(absA) === nodeFn.path.normalize(absB));
        },

        join: (...paths: string[]): string => {
            return nodeFn.fullfill.path.join(...paths);
        },
        normalize: (path: string): string => {
            return nodeFn.fullfill.path.normalize(path);
        },
        // intersectPath: (path1: string, path2: string): boolean => {
        //     return this.renderer.sendSync('path.intersectPath', [path1, path2]);
        // },
        // intersectAndReplacePath: (basePath: string, targetPath: string): boolean => {
        //     return this.renderer.sendSync('path.intersectAndReplacePath', [basePath, targetPath]);
        // },
    }

    static fs = {
        /*openSync: (path: fs.PathLike, flags: fs.OpenMode, mode?: fs.Mode | null) => {
            return this.renderer.sendSync('fs.openSync', [path, flags, mode]);
        },
        rename: (from: string, to: string) => {
            return this.renderer.sendSync('fs.rename', [from, to]);
        },

        copyFileSync: (fromPath: string, toPath: string, option?: number): string => {
            return this.renderer.sendSync('fs.copyFileSync', [fromPath, toPath, option]);
        },
        readFile: (path: string, encode: import('fs').WriteFileOptions = 'utf-8') => {
            return this.renderer.Invoke('fs.readFile', [{
                path: path,
                encode: encode,
                doCache: false,
            } as I_ReadFileSyncPerameters]);
        },
        readdirSyncDirent: (path: string, recursive?: boolean)
            : { name: string, isDir: boolean, isFile: boolean }[] => {
            return this.renderer.sendSync('fs.readdirSyncDirent', [path, recursive]);
        },
        */

        // rmSync: (path: fs.PathLike, options?: fs.RmOptions) => {
        //     return this.renderer.sendSync('fs.rmSync', [path, options]);
        // },
        // isDirectory: (path: fs.PathLike, options?: fs.StatSyncOptions): boolean => {
        //     return this.renderer.sendSync('fs.statSync.isDirectory', [path, options]);
        // },
        // mkdirSync: (path: string, options: fs.MakeDirectoryOptions): string => {
        //     return this.renderer.sendSync('fs.mkdirSync', [path, options]);
        // },
        // readdirSync: (path: string, encode: import('fs').WriteFileOptions = 'binary'): string[] => {
        //     return this.renderer.sendSync('fs.readdirSync', [path, encode]);
        // },
        // writeFileSync: (path: string, data: string, encode: import('fs').WriteFileOptions = 'utf-8') => {
        //     return this.renderer.sendSync('fs.writeFileSync', [{ path: path, data: data, encode: encode } as I_WriteFileSyncPerameters]);
        // },
        isDirectory: (path: fs.PathLike, options?: fs.StatSyncOptions): boolean => {
            return this.renderer.sendSync('fs.statSync.isDirectory', [path, options]);
        },
        existsSync: (path: string): boolean => {
            return this.renderer.sendSync('fs.existsSync', [path]);
        },
        readFileSync: (path: string, encode: import('fs').WriteFileOptions = 'utf-8', doCache = false): string | null => {
            let _finalpath = nodeFn.path.normalize(path);
            if (doCache) {
                let rtrn = this.readFileSyncStorage.get(_finalpath);
                if (rtrn != undefined) return rtrn;
                else {
                    rtrn = this.renderer.sendSync('fs.readFileSync', [_finalpath, encode,]);
                    if (rtrn != undefined)
                        this.readFileSyncStorage.set(_finalpath, rtrn);
                    return rtrn;
                }
            } else {
                return this.renderer.sendSync('fs.readFileSync', [_finalpath, encode,]);
            }
        },
        readFileBase64Sync: (path: string, encode: import('fs').WriteFileOptions = 'utf-8'): string | null => {
            let _finalpath = nodeFn.path.normalize(path);
            return this.renderer.sendSync('fs.readFileBase64Sync', [_finalpath, encode]);
        },
    }
    static resource = {
        all: () => {
            return this.renderer.sendSync('resource.all', []) as  [string, fileEntry][];
        },
        getResource: (resKey: string, type: FileTypes, valOrPath: string): string => {
            const res = this.renderer.sendSync('resource.getResource', [resKey, type, valOrPath]) as fileEntry;
            if (res == undefined) {
                console.log(`!!!! AT 'nodeFn.resource.getFile' NO FILE FOUND '${valOrPath}' `);
                return undefined;
            }
            ////console.log(res);
            return res?.value;
        },
        getValue: (key: string,
            value: string): string => {
            return this.renderer.sendSync('resource.getValue', [key, value]);
        }
    }
}