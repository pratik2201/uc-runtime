import { IpcRendererEvent } from "electron";
import { KeyboardKey } from "../../lib/hardware.js";
export const UC_ACCESS_KEY = '_____UC____';
export interface ProjectPrimaryAlias { alice?: string; aliceValue?: string; projectPath?: string; }
export class PreloadFullFill {
    url = {
        fileURLToPath: undefined as (url: string) => string,
        pathToFileURL: undefined as (pth: string) => string,
    };
    path = {
        extname: undefined as (path: string) => string,
        isAbsolute: undefined as (path: string) => boolean,
        basename: undefined as (path: string, suffix?: string) => string,
        relative: undefined as (from: string, to: string) => string,
        dirname: undefined as (path: string) => string,
        normalize: undefined as (path: string) => string,
        join: undefined as (...paths: string[]) => string,
        resolve: undefined as (...paths: string[]) => string,
    };
}

export function correctpath(str: string, trim = false): string {
    let ns = str.replace(/[\\\/]+/gi, "/");
    return trim ? _trim_(ns, "/") : ns;
}
export function cleanPath(path) {
    return path.replace(/^(\.?\.?\/)+/, "");
}
export function GetUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export function GetRandomNo(min: number = 0, max: number = 1000000): number {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}
// export function getRemainingPath(longPath: string, pathRemoveFromPathAtStart: string) {
//     longPath = longPath.replace(/\\/g, "/");
//     pathRemoveFromPathAtStart = pathRemoveFromPathAtStart.replace(/\\/g, "/");

//     const baseParts = longPath.split("/");
//     const targetParts = pathRemoveFromPathAtStart.split("/");

//     let commonLength = 0;
//     for (let i = 0; i < Math.min(baseParts.length, targetParts.length); i++) {
//         if (baseParts[i] === targetParts[i]) {
//             commonLength = i + 1;
//         } else {
//             break;
//         }
//     }
//     return baseParts.slice(commonLength).join("/");
// }
export function _trim_(mstr: string, charlist: string) {
    if (charlist === undefined)
        charlist = "\s";
    return mstr.replace(new RegExp("^[" + charlist + "]+$", 'ig'), "");
}
export type IPC_REGISTER_KEY = string;
 
export function isSamePath(a: string, b: string, pathModule: typeof import('path')) {
    const absA = pathModule.resolve(a);
    const absB = pathModule.resolve(b);
    return (pathModule.normalize(absA) === pathModule.normalize(absB));
}
 
export function getCloneableObject(obj, seen = new WeakMap(), path = '') {
    if (obj === null || typeof obj !== 'object') return obj;
    if (seen.has(obj)) {
        return seen.get(obj);
    }
    let clone;
    if (Array.isArray(obj)) {
        clone = [];
        seen.set(obj, clone);
        for (let i = 0; i < obj.length; i++) {
            const val = getCloneableObject(obj[i], seen, `${path}[${i}]`);
            clone.push(val);
        }
    } else {
        clone = {};
        seen.set(obj, clone);
        for (const [key, value] of Object.entries(obj)) {
            const type = typeof value;

            if (
                value === null ||
                type === 'string' ||
                type === 'number' ||
                type === 'boolean'
            ) {
                clone[key] = value;
            } else if (type === 'object') {
                if (value instanceof Date) {
                    clone[key] = value.toISOString();
                } else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
                    clone[key] = value['slice'] ? value['slice'](0) : value;
                } else if (value instanceof Error || value instanceof Node) {
                    // skip errors and DOM nodes
                } else {
                    clone[key] = getCloneableObject(value, seen, path + '.' + key);
                }
            }
            // skip functions, undefined, symbols, etc.
        }
    }

    return clone;
}

export type IpcRendererCallBack = (e: IpcRendererEvent, ...args: any[]) => void;
export interface BridgeAPI {
    fromMain?: (chennel: string, callback: IpcRendererCallBack) => void;
    sendSync?: (chennel: string, ...args: any[]) => any;
    send?: (chennel: string, ...args: any[]) => void;
    invoke?: (chennel: string, ...args: any[]) => Promise<any>;
    on?: (chennel, callback: IpcRendererCallBack) => void;
    INIT_IMPORT_MAP?: (_win: Window) => void;
}
export const IPC_API_KEY = `ucbuilderAPI`; //_${(Math.random()*98464562)}_`;
export function IPC_GET_KEY(actionKey: string, regKey: IPC_REGISTER_KEY) {
    return actionKey + ";" + regKey;
}
export function IPC_SPLIT_KEY(actionKey: string): { action: string, regKey: string } {
    let rtrn = actionKey.split(';');
    return { action: rtrn[0], regKey: rtrn[1] };
}
 
export interface IImportMap {
    imports?: { [alice: string]: string; };
    scopes?: {
        [scope: string]: {
            [alice: string]: string;
        };
    };
}

export function deepAssign(target, ...sources) {
    if (!target || typeof target !== "object") return target;
    for (const source of sources) {
        if (!source || typeof source !== "object") continue;
        for (const key of Object.keys(source)) {
            const sourceValue = source[key];
            if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
                if (sourceValue.constructor !== Object) {
                    // Preserve class instances
                    target[key] = sourceValue;
                } else {
                    // Ensure target has an object before deep merging
                    if (!target[key] || typeof target[key] !== "object") {
                        target[key] = {};
                    }
                    deepAssign(target[key], sourceValue);
                }
            } else {
                target[key] = sourceValue;
            }
        }
    }
    return target;
}

export class ProjectRowBase<K = any> {
    projectName?: string = "";
    importMetaURL: string = "";
    projectPath?: string = "";
    rootPath?: string = "";
    aliceToPath?: { [alice: string]: string; } = {};
    projectPrimaryAlice?: string = "";
    children?: K[] = [];
    config? = new UserUCConfig();
}
export class ProjectRowR extends ProjectRowBase<ProjectRowR> {
    id: number;
    defaultLoadAt: HTMLElement = undefined;
    stampSRC: import("../../lib/StampGenerator.js").SourceNode = undefined; 
} 
export function getMetaUrl<K>(fullPath: string, ar: ProjectRowBase<K>[]): string {
    fullPath = correctpath(fullPath);
    return ar.find((row: ProjectRowBase<K>) => fullPath.startsWith(row.projectPath))?.importMetaURL;
}
export function subtractPath(basePath: string, targetPath: string, pathModule: typeof import('path')) {
    const absBase = pathModule.resolve(basePath);
    const absTarget = pathModule.resolve(targetPath);

    // Get relative path from base to target
    const relative = pathModule.relative(absBase, absTarget);

    //  return relative;
    return relative;
}

export function GetPackage(projectdir: string, path: typeof import('path'), fs: typeof import('fs')): string | undefined {
    let package_file_path = path.join(projectdir, 'package.json');
    if (fs.existsSync(package_file_path)) {
        return JSON.parse(fs.readFileSync(package_file_path, 'binary'));
    }
    return undefined;
}
export function GetProjectName(projectdir: string, path: typeof import('path'), fs: typeof import('fs')): string | undefined {
    let package_file_path = path.join(projectdir, 'package.json');
    //console.log(package_file_path);

    if (fs.existsSync(package_file_path)) {
        let packageContent = JSON.parse(fs.readFileSync(package_file_path, 'binary'));
        if (packageContent != undefined)
            return packageContent.name;
    }
    return undefined;
}
export function GetProject<K>(_path: string, projectsArray: ProjectRowBase<K>[], url: typeof import('url')) {

    let callerFilePath = _path.startsWith('file:///') ? url.fileURLToPath(_path) : _path;
    callerFilePath = correctpath(callerFilePath);
    return projectsArray.find(proj => callerFilePath.startsWith(proj.projectPath));
}
export function resolvePathObject<K>(filePath: string, callerMetaUrl: string, projectsArray: ProjectRowBase<K>[], project: ProjectRowBase<K>, path: typeof import('path'), url: typeof import('url')): IResolvePathResult | undefined {
    let rtrn: IResolvePathResult<K> = {};
    if (callerMetaUrl == undefined) return {
        result: filePath,
        isFullPath: true
    }
    project = project ?? GetProject(callerMetaUrl, projectsArray, url);
    // if (project == undefined) {
    //     let callerFilePath = callerMetaUrl.startsWith('file:///') ? url.fileURLToPath(callerMetaUrl) : callerMetaUrl;
    //     callerFilePath = correctpath(callerFilePath);
    //     project = projectsArray.find(proj => callerFilePath.startsWith(proj.projectPath));
    // }
    if (!project) {
        throw Error("filePath is miss match (OUT OF syllabus)");
        return undefined;
    }
    rtrn.project = project as any;
    for (const [alias, relativeAliasPath] of Object.entries(project.config.browser.importmap)) {
        if (filePath.startsWith(alias)) {
            const relativeFilePath = filePath.replace(alias, `/${relativeAliasPath}/`);
            const absoluteFilePath = path.normalize(path.join(project.projectPath, relativeFilePath));
            rtrn.alias = alias;
            rtrn.aliasPath = relativeAliasPath;
            rtrn.result = absoluteFilePath;
            rtrn.isFullPath = false;
            return rtrn as any;
        }
    }
    //console.log(filePath);

    if (filePath.match(/^\.{1,2}[\/\\]/) != null) {

        rtrn.isFullPath = false;
        let pdir = project.projectPath;// callerMetaUrl.substring(0, callerMetaUrl.lastIndexOf('/')); // project.projectPath;
        rtrn.result = path.resolve(pdir, filePath);
        return rtrn as any;
    }
    rtrn.isFullPath = true;
    rtrn.result = filePath;
    return rtrn as any;
}
function isAbsolutePath(p: string): boolean {
    if (!p) return false;

    // Windows absolute path: C:\ or \\server\share
    if (/^[a-zA-Z]:[\\/]/.test(p)) return true;
    if (/^\\\\/.test(p)) return true; // UNC path
    if (/^\\\\\?\\/.test(p)) return true; // Extended path

    // POSIX absolute path: starts with /
    if (p.startsWith("/")) return true;

    return false;
}

export type IResolvePathResult<K = ProjectRowR> = {
    result?: string;
    project?: K;
    isFullPath?: boolean;

    alias?: string;
    aliasPath?: string;
};

export class UserUCConfig<K = IDirDeclarations> {

    /**
     * undefined guid will generate random new uuid on build time
     */
    guid = undefined as string;
    projectName = undefined as string;

    env: 'developer' | 'release' = 'developer';
    exports: 'types' | 'import' = 'import';
    mainAlias: string;
    browser = {
        importmap: {} as { [alice: string]: string; },
        //globalAlias: {} as { [alice: string]: string; },
    };
    preference?: IUCConfigPreference<K> = {
        build: new UcBuildOptions<K>(),
        dirDeclaration: {} as any,
        fileCommonDeclaration: {},
        srcDir: "" as any,
        outDir: "" as any,
    };
    projectBaseCssPath?: string = "styles.scss";

}
export type GuidSequenceType = "sequenceAndSameGuid" | "randomGuidAndNoSequence";
export class BuildTimeGuidMeta {
    guidType = "sequenceAndSameGuid" as GuidSequenceType;
    sequencePadSize = 8;
}
export class UcBuildOptions<K = IDirDeclarations> {
    keyBind?: KeyboardKey[] = ['ControlRight', 'F12'];
    guidOptions = new BuildTimeGuidMeta();
    ignorePath?: string[] = ["node_modules", ".vscode", "out", "dist", ".git"];
    /**
     * specify path for generate resource file inside `src` declaration
     * this file will store all resources in string format
     * please import this file just after ucbuilder mainhelper init
     */
    ResourceDeclarationFile?: string = "./Resources.ts";
    RuntimeResources: RuntimeFileManage<K>[] = [];
    // ResourcesRegister: {

    // }
}

class RuntimeFileManage<K = IDirDeclarations> {
    includeCallback = undefined as (filepath: string) => boolean;
    includeExtensions = [] as string[];
    fromDeclare: keyof K;
    toDeclares: Array<keyof K>;
}
export type FileDeclarationTypes = 'code' | 'designer' | 'tsLayout' | 'htmlLayout' | 'html' | 'scss';
export type DirDeclarationTypes = 'out' | 'src' | 'dist';
export type IFileDeclarationTypesMap = {
    [s in Partial<FileDeclarationTypes>]: string;
};

export const SourceFileTypeMap: IFileDeclarationTypesMap = {
    html: '',
    scss: '',
    code: '',
    designer: '',
    tsLayout: '',
    htmlLayout: ''
}
// export type IQuickDirDeclaration = {
//     [dirPath: string]: Partial<{ [s in FileDeclarationTypes]: IFileDeclaration }>
// }
export class IDirDeclaration {
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
    fileDeclaration?: Partial<{ [s in FileDeclarationTypes]: IFileDeclaration }> = {

    };
}
export type IDirDeclarations = {
    [dirDeclareKey: string]: IDirDeclaration
}
export type IDirDeclarationTypesMap = {
    [dirDeclareKey: string]: IFileDeclarationTypesMap
}

export class IFileDeclaration {
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
    subDirPath: string = '';

    /**
     *  i.e  
     * ```ts
     * ./src/lib/file.uc[.xt].html     =>    ./src/lib/file.uc.xt.html     
     * ./src/lib/file.uc[.designer].ts     =>    ./src/lib/file.uc.designer.ts
     * ```
     */
    extension: string = '';

}
export class IUCConfigPreference<K = IDirDeclarations> {
    build = new UcBuildOptions<K>();

    dirDeclaration?: K = {

    } as any;
    /**
     * A common Declaration  for all items in `dirDeclaration`
     */
    fileCommonDeclaration?: Partial<{ [s in FileDeclarationTypes]: IFileDeclaration }> = {};

    /**
     * specify dirDeclaration key for output 
     */
    outDir?: keyof K = '' as any;
    /**
    * specify dirDeclaration key for source 
    */
    srcDir?: keyof K = '' as any;
}

