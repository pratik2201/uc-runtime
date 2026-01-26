export const UC_ACCESS_KEY = '_____UC____';
export class PreloadFullFill {
    url = {
        fileURLToPath: undefined,
        pathToFileURL: undefined,
    };
    path = {
        isAbsolute: undefined,
        basename: undefined,
        relative: undefined,
        dirname: undefined,
        normalize: undefined,
        join: undefined,
        resolve: undefined,
    };
}
export function correctpath(str, trim = false) {
    let ns = str.replace(/[\\\/]+/gi, "/");
    return trim ? _trim_(ns, "/") : ns;
}
export function cleanPath(path) {
    return path.replace(/^(\.?\.?\/)+/, "");
}
export function GetUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export function GetRandomNo(min = 0, max = 1000000) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}
export function getRemainingPath(longPath, pathRemoveFromPathAtStart) {
    longPath = longPath.replace(/\\/g, "/");
    pathRemoveFromPathAtStart = pathRemoveFromPathAtStart.replace(/\\/g, "/");
    const baseParts = longPath.split("/");
    const targetParts = pathRemoveFromPathAtStart.split("/");
    let commonLength = 0;
    for (let i = 0; i < Math.min(baseParts.length, targetParts.length); i++) {
        if (baseParts[i] === targetParts[i]) {
            commonLength = i + 1;
        }
        else {
            break;
        }
    }
    return baseParts.slice(commonLength).join("/");
}
export function _trim_(mstr, charlist) {
    if (charlist === undefined)
        charlist = "\s";
    return mstr.replace(new RegExp("^[" + charlist + "]+$", 'ig'), "");
}
/*export interface IPC_ROOT_RENDERER_API_KEY_NODE {
    key: string;
    sortpath: string;
    url: string;
    fileurl?: string;
    project?: ProjectRowM;
}*/
export function isSamePath(a, b, pathModule) {
    const absA = pathModule.resolve(a);
    const absB = pathModule.resolve(b);
    return (pathModule.normalize(absA) === pathModule.normalize(absB));
}
// export function GetRootPathByUrl_M(urlPath: string, ucConfigList: ProjectRowM[]) {
//     let rtrn: IPC_REGISTER_KEY = { sortpath: "", url: "", project: undefined };
//     rtrn.project = ucConfigList.find(cfg => urlPath.startsWith(cfg.importMetaURL)) || null;
//     if (rtrn.project == null) {
//         console.log('notsafafs found');
//         return undefined;
//     }
//     rtrn.sortpath = correctpath(rtrn.project.projectPrimaryAlice + '/' + urlPath.substring(rtrn.project.importMetaURL.length));
//     rtrn.url = rtrn.project.importMetaURL;
//     rtrn.fileurl = urlPath;
//     //console.log(rtrn);
//     return rtrn;
// }
export function getCloneableObject(obj, seen = new WeakMap(), path = '') {
    if (obj === null || typeof obj !== 'object')
        return obj;
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
    }
    else {
        clone = {};
        seen.set(obj, clone);
        for (const [key, value] of Object.entries(obj)) {
            const type = typeof value;
            if (value === null ||
                type === 'string' ||
                type === 'number' ||
                type === 'boolean') {
                clone[key] = value;
            }
            else if (type === 'object') {
                if (value instanceof Date) {
                    clone[key] = value.toISOString();
                }
                else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
                    clone[key] = value['slice'] ? value['slice'](0) : value;
                }
                else if (value instanceof Error || value instanceof Node) {
                    // skip errors and DOM nodes
                }
                else {
                    clone[key] = getCloneableObject(value, seen, path + '.' + key);
                }
            }
            // skip functions, undefined, symbols, etc.
        }
    }
    return clone;
}
export const IPC_API_KEY = `ucbuilderAPI`; //_${(Math.random()*98464562)}_`;
export function IPC_GET_KEY(actionKey, regKey) {
    return actionKey + ";" + regKey;
}
export function IPC_SPLIT_KEY(actionKey) {
    let rtrn = actionKey.split(';');
    return { action: rtrn[0], regKey: rtrn[1] };
}
export function deepAssign(target, ...sources) {
    if (!target || typeof target !== "object")
        return target;
    for (const source of sources) {
        if (!source || typeof source !== "object")
            continue;
        for (const key of Object.keys(source)) {
            const sourceValue = source[key];
            if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
                if (sourceValue.constructor !== Object) {
                    // Preserve class instances
                    target[key] = sourceValue;
                }
                else {
                    // Ensure target has an object before deep merging
                    if (!target[key] || typeof target[key] !== "object") {
                        target[key] = {};
                    }
                    deepAssign(target[key], sourceValue);
                }
            }
            else {
                target[key] = sourceValue;
            }
        }
    }
    return target;
}
export class ProjectRowBase {
    projectName = "";
    importMetaURL = "";
    projectPath = "";
    rootPath = "";
    // pathToAlice?: { [projectPath: string]: string; } = {};
    aliceToPath = {};
    projectPrimaryAlice = "";
    //directoryOfFileType: ISourceFileTypeMap = JSON.parse(JSON.stringify(SourceFileTypeMap));
    //directoryOfType: ISourceTypeMap = JSON.parse(JSON.stringify(SourceTypeMap));
    children = [];
    config = new UserUCConfig();
}
export class ProjectRowR extends ProjectRowBase {
    id;
    defaultLoadAt = undefined;
    stampSRC = undefined;
}
// export class ProjectRowM extends ProjectRowBase<ProjectRowM> {
//     //children?: ProjectRowM[] = [];
// }
export function getMetaUrl(fullPath, ar) {
    fullPath = correctpath(fullPath);
    return ar.find((row) => fullPath.startsWith(row.projectPath))?.importMetaURL;
}
export function subtractPath(basePath, targetPath, pathModule) {
    const absBase = pathModule.resolve(basePath);
    const absTarget = pathModule.resolve(targetPath);
    // Get relative path from base to target
    const relative = pathModule.relative(absBase, absTarget);
    //  return relative;
    return relative;
}
export function GetPackage(projectdir, path, fs) {
    let package_file_path = path.join(projectdir, 'package.json');
    if (fs.existsSync(package_file_path)) {
        return JSON.parse(fs.readFileSync(package_file_path, 'binary'));
    }
    return undefined;
}
export function GetProjectName(projectdir, path, fs) {
    let package_file_path = path.join(projectdir, 'package.json');
    //console.log(package_file_path);
    if (fs.existsSync(package_file_path)) {
        let packageContent = JSON.parse(fs.readFileSync(package_file_path, 'binary'));
        if (packageContent != undefined)
            return packageContent.name;
    }
    return undefined;
}
export function GetProject(_path, projectsArray, url) {
    let callerFilePath = _path.startsWith('file:///') ? url.fileURLToPath(_path) : _path;
    callerFilePath = correctpath(callerFilePath);
    return projectsArray.find(proj => callerFilePath.startsWith(proj.projectPath));
}
export function resolvePathObject(filePath, callerMetaUrl, projectsArray, project, path, url) {
    let rtrn = {};
    if (callerMetaUrl == undefined)
        return {
            result: filePath,
            isFullPath: true
        };
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
    rtrn.project = project;
    for (const [alias, relativeAliasPath] of Object.entries(project.config.browser.importmap)) {
        if (filePath.startsWith(alias)) {
            const relativeFilePath = filePath.replace(alias, `/${relativeAliasPath}/`);
            const absoluteFilePath = path.normalize(path.join(project.projectPath, relativeFilePath));
            rtrn.alias = alias;
            rtrn.aliasPath = relativeAliasPath;
            rtrn.result = absoluteFilePath;
            rtrn.isFullPath = false;
            return rtrn;
        }
    }
    //console.log(filePath);
    if (filePath.match(/^\.{1,2}[\/\\]/) != null) {
        rtrn.isFullPath = false;
        let pdir = project.projectPath; // callerMetaUrl.substring(0, callerMetaUrl.lastIndexOf('/')); // project.projectPath;
        rtrn.result = path.resolve(pdir, filePath);
        return rtrn;
    }
    rtrn.isFullPath = true;
    rtrn.result = filePath;
    return rtrn;
}
function isAbsolutePath(p) {
    if (!p)
        return false;
    // Windows absolute path: C:\ or \\server\share
    if (/^[a-zA-Z]:[\\/]/.test(p))
        return true;
    if (/^\\\\/.test(p))
        return true; // UNC path
    if (/^\\\\\?\\/.test(p))
        return true; // Extended path
    // POSIX absolute path: starts with /
    if (p.startsWith("/"))
        return true;
    return false;
}
export class UserUCConfig {
    guid;
    env = 'developer';
    exports = 'import';
    mainAlias;
    browser = {
        importmap: {},
        //globalAlias: {} as { [alice: string]: string; },
    };
    preference = {
        build: new UcBuildOptions(),
        dirDeclaration: {},
        fileCommonDeclaration: {},
        srcDir: "",
        outDir: "",
    };
    projectBaseCssPath = "styles.scss";
}
export class UcBuildOptions {
    keyBind = ['ControlRight', 'F12'];
    ignorePath = ["node_modules", ".vscode", "out", "dist", ".git"];
    RuntimeResources = [];
}
class RuntimeFileManage {
    includeCallback = undefined;
    includeExtensions = [];
    fromDeclare;
    toDeclares;
}
export const SourceFileTypeMap = {
    html: '',
    scss: '',
    code: '',
    designer: '',
    dynamicDesign: ''
};
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
    dirPath;
    /**
     * specify filePath
     */
    fileDeclaration = {};
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
    subDirPath = '';
    /**
     *  i.e
     * ```ts
     * ./src/lib/file.uc[.xt].html     =>    ./src/lib/file.uc.xt.html
     * ./src/lib/file.uc[.designer].ts     =>    ./src/lib/file.uc.designer.ts
     * ```
     */
    extension = '';
}
export class IUCConfigPreference {
    build = new UcBuildOptions();
    dirDeclaration = {};
    /**
     * A common Declaration  for all items in `dirDeclaration`
     */
    fileCommonDeclaration = {};
    /**
     * specify dirDeclaration key for output
     */
    outDir = '';
    /**
    * specify dirDeclaration key for source
    */
    srcDir = '';
}
//# sourceMappingURL=enumAndMore.js.map