import { SpecialExtType, ucUtil } from "../global/ucUtil.js";
import { ISourceFileTypeMap, SourceFileType, ProjectRowR, SourceType, getMetaUrl, IResolvePathResult, IBuildDirectoryResult, SourceTypeMap, SourceFileTypeMap, GetProject, IFileDeclaration } from "../ipc/enumAndMore.js";
import { ProjectManage } from "../ipc/ProjectManage.js";
import { nodeFn } from "../nodeFn.js";
import { PathBridge } from "./pathBridge.js";

interface FileNode {
    rootPath?: string;
    fullPath?: string;
    out?: FileNode;
}
export function GetAliceInfoByPath(filePath: string, projectRows = ProjectManage.projects) {
    const rtrn = {
        alias: undefined as string,
        rootPath: undefined as string,
        absolutePath: undefined as string,
        project: undefined as ProjectRowR,
    }
    for (let index = 0; index < projectRows.length; index++) {
        const projectRow = projectRows[index];
        for (const [alias, relativeAliasPath] of Object.entries(projectRow.config.browser.importmap)) {
            if (filePath.startsWith(alias)) {
                const relativeFilePath = filePath.replace(alias, `/${relativeAliasPath}/`);
                const absoluteFilePath = nodeFn.path.normalize(nodeFn.path.join(projectRow.projectPath, relativeFilePath));
                rtrn.alias = alias;
                rtrn.rootPath = relativeFilePath;
                rtrn.project = projectRow;
                rtrn.absolutePath = absoluteFilePath;
                return rtrn;
            }
        }
    }
    return rtrn;
}
export function GetDeclaration(filepath: string, projectRows = ProjectManage.projects) {
    if (filepath.startsWith('file:///')) filepath = nodeFn.url.fileURLToPath(filepath);
    const rtrn = {
        project: GetProject(filepath, projectRows, nodeFn.url as any),
        dirDec: undefined as string,
        fileDec: undefined as string,
    }
    if (rtrn.project == undefined) {
        let res = GetAliceInfoByPath(filepath, projectRows);
        if (res.project == undefined) return rtrn;
        rtrn.project = res.project;
        filepath = res.absolutePath;
    }
    const np = nodeFn.path;
    const projPath = rtrn.project.projectPath;
    const cfg = rtrn.project.config;
    const pref = cfg.preference;
    const dirDec = Object.entries(pref.dirDeclaration);
    for (const [k, ddn] of dirDec) {
        const joinedDDN = np.join(projPath, ddn.dirPath);
        if (np.startsWith(filepath, joinedDDN)) {
            rtrn.dirDec = k as any;
            const fileDec = Object.entries(ddn.fileWisePath);
            let isFileFound = false;
            for (const [j, fdn] of fileDec) {
                let ext = filepath.substring(filepath.length - fdn.extension.length);
                if (ext.toLowerCase() === fdn.extension.toLowerCase()) {
                    if (fdn.dirPath != '' && !np.startsWith(filepath, np.join(joinedDDN, fdn.dirPath))) continue;
                    isFileFound = true;
                    rtrn.fileDec = j;
                }
            }
            if (isFileFound)
                break;
        }
    }
    return rtrn;
}

export class codeFileInfo {
    name = "";
    extCode: SpecialExtType;
    /*constructor(extCode: SpecialExtType) {
        this.extCode = extCode;
    }*/
    static getExtType(path: string): SpecialExtType {
        let spl = path.split(/[\/\\]/gi);
        let fname = spl.pop();
        let far = fname.split('.');
        if (far.lastIndexOf('uc') >= 0) return '.uc';
        else if (far.lastIndexOf('tpt') >= 0) return '.tpt';
        else return 'none';
    }
    pathOf: ISourceFileTypeMap;
    resolvePathResult: IResolvePathResult;
    fullWithoutExt = (ftype: SourceFileType) => {
        return ucUtil.changeExtension(this.pathOf[ftype], `${this.extCode}${ftype}`, '');
    }
    pathWithExt = (ftype: SourceFileType) => {
        return ucUtil.changeExtension(this.pathOf[ftype], `${ftype}`, '');
    }
    static GetFileName(filePath: string) {
        const fileName = filePath.split(/[\\/]/).pop();
        return fileName.split('.')[0];
    }
    allPathOf: IBuildDirectoryResult;
    callerMetaUrl: string;
    callerProject: ProjectRowR; // actualPro
    get projectInfo() { return this.callerProject; /*this.resolvePathResult?.project;*/ }
    parseUrl(_path: string, sourceType: 'out' | 'src' | string, callerMetaUrl?: string): boolean {
        this.callerMetaUrl = callerMetaUrl;
        let fullpath = PathBridge.GetFullPath(_path, callerMetaUrl);

        let dec = GetDeclaration(fullpath);
        this.callerProject = dec.project as any;
        _path = fullpath;
        if (dec.fileDec == undefined || this.callerProject == undefined) {
            console.info(`'${_path}' is not valid file type for codeFileInfo.parseUrl`);
            return false;
        }
        else {
            this.allPathOf = PathBridge.Convert(_path, dec.dirDec as any, dec.fileDec as any /*sourceType as any, GIVEN_PATH_TYPE*/);
            this.pathOf = this.allPathOf[dec.dirDec];
            this.extCode = codeFileInfo.getExtType(this.pathOf.code);
            if (this.pathOf == undefined) {
                console.warn(`'${_path}' is not appropriate for codeFileInfo.parseUrl`);
                return false;
            }
        }
        this.name = codeFileInfo.GetFileName(this.pathOf.html);
        return true;
    }
    get mainFileRootPath_btoa() { return window.btoa(this.fullWithoutExt('html')); }
}

