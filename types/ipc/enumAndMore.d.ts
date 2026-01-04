import { KeyboardKey } from "../lib/hardware.js";
import type { IpcRendererEvent } from "electron";
export interface ProjectPrimaryAlias {
    alice?: string;
    aliceValue?: string;
    projectPath?: string;
}
export declare class PreloadFullFill {
    url: {
        fileURLToPath: (url: string) => string;
        pathToFileURL: (pth: string) => string;
    };
    path: {
        basename: (path: string, suffix?: string) => string;
        relative: (from: string, to: string) => string;
        dirname: (path: string) => string;
        normalize: (path: string) => string;
        join: (...paths: string[]) => string;
        resolve: (...paths: string[]) => string;
    };
}
export declare function correctpath(str: string, trim?: boolean): string;
export declare function cleanPath(path: any): any;
export declare function GetUniqueId(): string;
export declare function GetRandomNo(min?: number, max?: number): number;
export declare function getRemainingPath(longPath: string, pathRemoveFromPathAtStart: string): string;
export declare function _trim_(mstr: string, charlist: string): string;
export type IPC_REGISTER_KEY = string;
export declare function isSamePath(a: string, b: string, pathModule: typeof import('path')): boolean;
export declare function getCloneableObject(obj: any, seen?: WeakMap<WeakKey, any>, path?: string): any;
export type IpcRendererCallBack = (e: IpcRendererEvent, ...args: any[]) => void;
export interface BridgeAPI {
    fromMain?: (chennel: string, callback: IpcRendererCallBack) => void;
    sendSync?: (chennel: string, ...args: any[]) => any;
    send?: (chennel: string, ...args: any[]) => void;
    invoke?: (chennel: string, ...args: any[]) => Promise<any>;
    on?: (chennel: any, callback: IpcRendererCallBack) => void;
    INIT_IMPORT_MAP?: (_win: Window) => void;
}
export declare const IPC_API_KEY = "ucbuilderAPI";
export declare function IPC_GET_KEY(actionKey: string, regKey: IPC_REGISTER_KEY): string;
export declare function IPC_SPLIT_KEY(actionKey: string): {
    action: string;
    regKey: string;
};
export type SourceFileType = '.ts' | '.designer.ts' | '.js' | '.designer.js' | '.html' | '.scss';
export type SourceType = 'out' | 'src';
export type ISourceFileTypeMap = {
    [s in Partial<SourceFileType>]: string;
};
export type ISourceTypeMap = {
    [s in Partial<SourceType>]: string;
};
export declare const SourceFileTypeMap: ISourceFileTypeMap;
export declare const SourceTypeMap: ISourceTypeMap;
export declare function GiveSourceFileTypeFeedBack(path: string): SourceFileType;
export declare class UcBuildOptions {
    keyBind?: KeyboardKey[];
    ignorePath?: string[];
    buildPath?: string;
}
export declare class IDeveloperOptions {
    build: UcBuildOptions;
}
export interface IUCConfigPreference {
    designerDir?: string;
    jsDir?: string;
    tsDir?: string;
    projectStyleFilePath?: string;
}
export interface IImportMap {
    imports?: {
        [alice: string]: string;
    };
    scopes?: {
        [scope: string]: {
            [alice: string]: string;
        };
    };
}
export declare function deepAssign(target: any, ...sources: any[]): any;
export declare class UserUCConfig {
    env: 'developer' | 'user';
    exports: 'types' | 'import';
    preloadMain: string[];
    browser: {
        importmap: {
            [alice: string]: string;
        };
        globalAlias: {
            [alice: string]: string;
        };
    };
    preference?: IUCConfigPreference;
    developer: IDeveloperOptions;
    type?: "ts" | "js";
}
export declare class ProjectRowBase<K = any> {
    projectName?: string;
    importMetaURL: string;
    projectPath?: string;
    aliceToPath?: {
        [alice: string]: string;
    };
    projectPrimaryAlice?: string;
    directoryOfFileType: ISourceFileTypeMap;
    directoryOfType: ISourceTypeMap;
    children?: K[];
    config?: UserUCConfig;
}
export declare class ProjectRowR extends ProjectRowBase<ProjectRowR> {
    id: number;
    defaultLoadAt: HTMLElement;
    stampSRC: import("../lib/StampGenerator.js").SourceNode;
    type?: "ts" | "js";
    children?: ProjectRowR[];
}
export declare class ProjectRowM extends ProjectRowBase<ProjectRowM> {
    rootPath?: string;
    children?: ProjectRowM[];
}
export declare function getMetaUrl<K>(fullPath: string, ar: ProjectRowBase<K>[]): string;
export declare function subtractPath(basePath: string, targetPath: string, pathModule: typeof import('path')): string;
export declare function GetUcConfig(projectdir: string, path: typeof import('path'), fs: typeof import('fs')): string | undefined;
export declare function GetPackage(projectdir: string, path: typeof import('path'), fs: typeof import('fs')): string | undefined;
export declare function GetProjectName(projectdir: string, path: typeof import('path'), fs: typeof import('fs')): string | undefined;
export declare function GetProject<K>(_path: string, projectsArray: ProjectRowBase<K>[], url: typeof import('url')): ProjectRowBase<K>;
export declare function resolvePathObject<K>(filePath: string, callerMetaUrl: string, projectsArray: ProjectRowBase<K>[], project: ProjectRowBase<K>, path: typeof import('path'), url: typeof import('url')): IResolvePathResult | undefined;
export type IResolvePathResult<K = ProjectRowR> = {
    result?: string;
    project?: K;
    isFullPath?: boolean;
    alias?: string;
    aliasPath?: string;
};
