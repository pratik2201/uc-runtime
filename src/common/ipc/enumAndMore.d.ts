import { IpcRendererEvent } from "electron";
import { KeyboardKey } from "../../lib/hardware.js";
export declare const UC_ACCESS_KEY = "_____UC____";
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
        isAbsolute: (path: string) => boolean;
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
export declare class ProjectRowBase<K = any> {
    projectName?: string;
    importMetaURL: string;
    projectPath?: string;
    rootPath?: string;
    aliceToPath?: {
        [alice: string]: string;
    };
    projectPrimaryAlice?: string;
    children?: K[];
    config?: UserUCConfig<IDirDeclarations>;
}
export declare class ProjectRowR extends ProjectRowBase<ProjectRowR> {
    id: number;
    defaultLoadAt: HTMLElement;
    stampSRC: import("../../lib/StampGenerator.js").SourceNode;
}
export declare function getMetaUrl<K>(fullPath: string, ar: ProjectRowBase<K>[]): string;
export declare function subtractPath(basePath: string, targetPath: string, pathModule: typeof import('path')): string;
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
export declare class UserUCConfig<K = IDirDeclarations> {
    guid: string;
    env: 'developer' | 'release';
    exports: 'types' | 'import';
    mainAlias: string;
    browser: {
        importmap: {
            [alice: string]: string;
        };
    };
    preference?: IUCConfigPreference<K>;
    projectBaseCssPath?: string;
}
export declare class UcBuildOptions<K = IDirDeclarations> {
    keyBind?: KeyboardKey[];
    ignorePath?: string[];
    RuntimeResources: RuntimeFileManage<K>[];
}
declare class RuntimeFileManage<K = IDirDeclarations> {
    includeCallback: (filepath: string) => boolean;
    includeExtensions: string[];
    fromDeclare: keyof K;
    toDeclares: Array<keyof K>;
}
export type FileDeclarationTypes = 'code' | 'designer' | 'dynamicDesign' | 'html' | 'scss';
export type DirDeclarationTypes = 'out' | 'src' | 'dist';
export type IFileDeclarationTypesMap = {
    [s in Partial<FileDeclarationTypes>]: string;
};
export declare const SourceFileTypeMap: IFileDeclarationTypesMap;
export declare class IDirDeclaration {
    /**
     *  i.e
     * ```ts
     *  dirDeclaration.dirpath = 'src';
     *      ./[src]/lib/file.uc.ts     =>    ./src/lib/file.uc.ts
     *      ./[src]/lib/file.uc.html     =>    ./src/lib/file.uc.html
     *
     *  dirDeclaration.dirpath = '';
     *      ./[]/lib/file.uc.js     =>    ./lib/file.uc.js
     *      ./[]/lib/file.uc.html     =>    ./lib/file.uc.html
     *
     *  dirDeclaration.dirpath = 'out';
     *      ./[out]/lib/file.uc.js     =>    ./out/lib/file.uc.js
     *      ./[out]/lib/file.uc.html     =>    ./out/lib/file.uc.html
     * ```
     */
    dirPath: string;
    /**
     * specify filePath
     */
    fileDeclaration?: Partial<{
        [s in FileDeclarationTypes]: IFileDeclaration;
    }>;
}
export type IDirDeclarations = {
    [dirDeclareKey: string]: IDirDeclaration;
};
export type IDirDeclarationTypesMap = {
    [dirDeclareKey: string]: IFileDeclarationTypesMap;
};
export declare class IFileDeclaration {
    /**
     *  i.e
     * ```ts
     * dirDeclaration.dirpath = 'src';
     *
     * fileDeclaration.subDirPath = 'designerFiles'
     * ./[src]/[designerFiles]/lib/file.uc.designer.ts     =>    ./src/designerFiles/lib/file.uc.designer.ts
     *
     * fileDeclaration.subDirPath = ''
     * ./[src]/[]/lib/file.uc.ts     =>    ./src/lib/file.uc.ts
     *
     * fileDeclaration.subDirPath = 'htmlFiles'
     * ./[src]/[htmlFiles]/lib/file.uc.designer.ts     =>    ./src/htmlFiles/lib/file.uc.designer.ts
     * ```
     */
    subDirPath: string;
    /**
     *  i.e
     * ```ts
     * ./src/lib/file.uc[.xt].html     =>    ./src/lib/file.uc.xt.html
     * ./src/lib/file.uc[.designer].ts     =>    ./src/lib/file.uc.designer.ts
     * ```
     */
    extension: string;
}
export declare class IUCConfigPreference<K = IDirDeclarations> {
    build: UcBuildOptions<K>;
    dirDeclaration?: K;
    /**
     * A common Declaration  for all items in `dirDeclaration`
     */
    fileCommonDeclaration?: Partial<{
        [s in FileDeclarationTypes]: IFileDeclaration;
    }>;
    /**
     * specify dirDeclaration key for output
     */
    outDir?: keyof K;
    /**
    * specify dirDeclaration key for source
    */
    srcDir?: keyof K;
}
export {};
