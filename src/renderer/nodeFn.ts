import fs from 'fs';
import { IpcRendererHelper } from './ipc/IpcRendererHelper.js';
import crypto from "crypto";
import { ProjectManage } from './ipc/ProjectManage.js';
import { ucUtil } from '../global/ucUtil.js';
import { IPC_API_KEY, PreloadFullFill } from '../common/ipc/enumAndMore.js';
export interface I_WriteFileSyncPerameters { path: string, data: string, encode: fs.WriteFileOptions }
export interface I_ReadFileSyncPerameters { path: string, doCache?: boolean, encode: fs.WriteFileOptions }
export interface I_ExistsSyncPerameters { path: string, }
export interface I_PathBaseName { path: string, suffix: string }
export interface I_PathRelative { from: string, to: string }
export interface I_ModuleAlice { alice: string, path: string }

export class nodeFn {
    static renderer = IpcRendererHelper.Group('ucbuilder/src/main/nodeFn');

    static fullfill: PreloadFullFill = undefined;
    static onReady(callback: () => void) {
        this.renderer.loaded(callback);
    }

    static crypto = {
        toString: (size: number, encoding?: BufferEncoding): string => {
            return this.renderer.sendSync('crypto.toString', [size, encoding]);
        },
        randomBytes: (size: number): Buffer => {
            return this.renderer.sendSync('crypto.randomBytes', [size]);
        },
        convert: (data: any, from: crypto.Encoding = "utf-8", to: crypto.Encoding = "hex"): string => {
            return this.renderer.sendSync('crypto.convert', [data, from, to]);
        },
        encrypt: (data: any): string => {
            return this.crypto.convert(data, 'utf8', 'hex');
        },
        decrypt: (data: any): string => {
            return this.crypto.convert(data, 'hex', 'utf8');
        }
    }
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
    /* static resolver = {
         resolve: (importPath: string, importer?: string): string => {
             return this.renderer.sendSync('resolver.resolve', [importPath, importer]);
         },
         resolveOut: (importPath: string, importer?: string): string => {
             return this.renderer.sendSync('resolver.resolveOut', [importPath, importer]);
         }
     }*/
    static path = {
        startsWith: (thisPath: string, startWithThisPath: string) => {
            const base = nodeFn.path.resolve(startWithThisPath).toLowerCase();
            const target = nodeFn.path.resolve(thisPath).toLowerCase();

            const relative = nodeFn.path.relative(base, target);
            return relative && !relative.startsWith("..") && !nodeFn.path.isAbsolute(relative);
        },
        dirname: (path: string): string => {
            return this.fullfill.path.dirname(path);
            //return renderer.sendSync('path.dirname', [path]);
        },
        isAbsolute: (path: string) => {
            return this.fullfill.path.isAbsolute(path);
            //return renderer.sendSync('path.dirname', [path]);
        },
        basename: (path: string, suffix?: string): string => {
            return nodeFn.fullfill.path.basename(path, suffix);
            //return renderer.sendSync('path.basename', [{ path: path, suffix: suffix } as I_PathBaseName]);
        },
        relative: (from: string, to: string): string => {
            return this.fullfill.path.relative(from, to);
            //return renderer.sendSync('path.relative', [{ from: from, to: to } as I_PathRelative]);
        },
        resolve: (...paths: string[]): string => {
            return nodeFn.fullfill.path.resolve(...paths);
            //return renderer.sendSync('path.resolve', [paths]);
        },

        resolveFilePath: (fromFilePath: string, toFilePath: string): string => {
            let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
            let fspath = ucUtil.toFilePath(this.fullfill.path.resolve(ius, toFilePath));
            return fspath;
            //return renderer.sendSync('path.resolveFilePath', [basePath, path]);
        },
        relativeFilePath: (fromFilePath: string, path: string): string => {
            path = ucUtil.devEsc(path);
            let ius = this.fullfill.path.dirname(fromFilePath.startsWith('file:') ? this.fullfill.url.fileURLToPath(fromFilePath) : fromFilePath);
            let fspath = ucUtil.toFilePath(this.fullfill.path.relative(ius, path));
            return fspath;
            //return renderer.sendSync('path.relativeFilePath', [fromFilePath, path]);
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

            // Get relative path from base to target
            const relative = this.fullfill.path.relative(absBase, absTarget);
            return relative;

            //return renderer.sendSync('path.subtractPath', [basePath, targetPath]);
        },
        isSamePath: (path1: string, path2: string) => {
            const absA = nodeFn.path.resolve(path1);
            const absB = nodeFn.path.resolve(path2);
            return (nodeFn.path.normalize(absA) === nodeFn.path.normalize(absB));
            //return renderer.sendSync('path.isSamePath', [path1, path2]);
        },

        join: (...paths: string[]): string => {
            return nodeFn.fullfill.path.join(...paths);
            //return renderer.sendSync('path.join', [paths]);

        },
        normalize: (path: string): string => {
            return nodeFn.fullfill.path.normalize(path);
            //return renderer.sendSync('path.normalize', [path]);
        },
        // isAbsolute: (path: string): boolean => {
        //     return this.renderer.sendSync('path.isAbsolute', [path]);
        // },
        intersectPath: (path1: string, path2: string): boolean => {
            return this.renderer.sendSync('path.intersectPath', [path1, path2]);
        },
        intersectAndReplacePath: (basePath: string, targetPath: string): boolean => {
            return this.renderer.sendSync('path.intersectAndReplacePath', [basePath, targetPath]);
        },
        // ProjectResolve: (path: string, importMetaUrl: string) => {
        //     return ProjectManage.resolve(path as any, importMetaUrl);
        // }
    }
    private static readFileSyncStorage = new Map<string, string>();
    private static readFileSyncStorageCounter = 0;
    static fs = {
        openSync: (path: fs.PathLike, flags: fs.OpenMode, mode?: fs.Mode | null) => {
            return this.renderer.sendSync('fs.openSync', [path, flags, mode]);
        },
        existsSync: (path: string): boolean => {

            return this.renderer.sendSync('fs.existsSync', [path]);
        },
        rename: (from: string, to: string) => {
            return this.renderer.sendSync('fs.rename', [from, to]);
        },


        rmSync: (path: fs.PathLike, options?: fs.RmOptions) => {
            return this.renderer.sendSync('fs.rmSync', [path, options]);
        },
        isDirectory: (path: fs.PathLike, options?: fs.StatSyncOptions): boolean => {
            return this.renderer.sendSync('fs.statSync.isDirectory', [path, options]);
        },

        mkdirSync: (path: string, options: fs.MakeDirectoryOptions): string => {
            return this.renderer.sendSync('fs.mkdirSync', [path, options]);
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

        readFileSync: (path: string, encode: import('fs').WriteFileOptions = 'utf-8', doCache = false): string | null => {

            let _finalpath = nodeFn.path.normalize(path);
            if (doCache) {
                let rtrn = this.readFileSyncStorage.get(_finalpath);
                if (rtrn != undefined) return rtrn;
                else {
                    //console.log('cache..'+(this.readFileSyncStorageCounter++));

                    rtrn = this.renderer.sendSync('fs.readFileSync', [{
                        path: _finalpath,
                        encode: encode,
                        doCache: doCache,
                    } as I_ReadFileSyncPerameters]);
                    if (rtrn != undefined)
                        this.readFileSyncStorage.set(_finalpath, rtrn);
                    return rtrn;
                }
            } else {
                //console.log('no cache..'+(this.readFileSyncStorageCounter++));
                return this.renderer.sendSync('fs.readFileSync', [{
                    path: _finalpath,
                    encode: encode,
                    doCache: doCache,
                } as I_ReadFileSyncPerameters]);
            }

        },

        readdirSync: (path: string, encode: import('fs').WriteFileOptions = 'binary'): string[] => {
            return this.renderer.sendSync('fs.readdirSync', [path, encode]);
        },
        readdirSyncDirent: (path: string, recursive?: boolean)
            : { name: string, isDir: boolean, isFile: boolean }[] => {
            return this.renderer.sendSync('fs.readdirSyncDirent', [path, recursive]);
        },
        writeFileSync: (path: string, data: string, encode: import('fs').WriteFileOptions = 'utf-8') => {
            return this.renderer.sendSync('fs.writeFileSync', [{ path: path, data: data, encode: encode } as I_WriteFileSyncPerameters]);
        }
    }

}