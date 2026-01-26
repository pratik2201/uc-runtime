import { ucUtil } from "./ucUtil.js";
import { GetProject } from "../common/ipc/enumAndMore.js";
import { ProjectManage } from "../renderer/ipc/ProjectManage.js";
import { nodeFn } from "../renderer/nodeFn.js";
import { PathBridge } from "./pathBridge.js";
export function GetAliceInfoByPath(filePath, projectRows = ProjectManage.projects) {
    const rtrn = {
        alias: undefined,
        rootPath: undefined,
        absolutePath: undefined,
        project: undefined,
    };
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
export function GetDeclaration(filepath, projectRows = ProjectManage.projects) {
    if (filepath.startsWith('file:///'))
        filepath = nodeFn.url.fileURLToPath(filepath);
    const rtrn = {
        project: GetProject(filepath, projectRows, nodeFn.url),
        dirDec: undefined,
        fileDec: undefined,
    };
    if (rtrn.project == undefined) {
        let res = GetAliceInfoByPath(filepath, projectRows);
        if (res.project == undefined)
            return rtrn;
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
            rtrn.dirDec = k;
            let isFileFound = false;
            const fpathToLower = filepath.toLowerCase();
            const fileDec = Object.entries(ddn.fileDeclaration)
                .sort((a, b) => b[1].extension.length - a[1].extension.length);
            for (const [j, fdn] of fileDec) {
                if (fpathToLower.endsWith(fdn.extension.toLowerCase())) {
                    if (fdn.subDirPath != '' && !np.startsWith(filepath, np.join(joinedDDN, fdn.subDirPath)))
                        continue;
                    isFileFound = true;
                    rtrn.fileDec = j;
                    break;
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
    extCode;
    /*constructor(extCode: SpecialExtType) {
        this.extCode = extCode;
    }*/
    static getExtType(path) {
        let spl = path.split(/[\/\\]/gi);
        let fname = spl.pop();
        let far = fname.split('.');
        if (far.lastIndexOf('uc') >= 0)
            return '.uc';
        else if (far.lastIndexOf('tpt') >= 0)
            return '.tpt';
        else
            return 'none';
    }
    pathOf;
    resolvePathResult;
    fullWithoutExt = (ftype) => {
        return ucUtil.changeExtension(this.pathOf[ftype], `${this.extCode}${ftype}`, '');
    };
    pathWithExt = (ftype) => {
        return ucUtil.changeExtension(this.pathOf[ftype], `${ftype}`, '');
    };
    static GetFileName(filePath) {
        const fileName = filePath.split(/[\\/]/).pop();
        return fileName.split('.')[0];
    }
    allPathOf;
    callerMetaUrl;
    callerProject; // actualPro
    get projectInfo() { return this.callerProject; /*this.resolvePathResult?.project;*/ }
    parseUrl(_path, demandType, callerMetaUrl) {
        this.callerMetaUrl = callerMetaUrl;
        let fullpath = PathBridge.GetFullPath(_path, callerMetaUrl);
        let dec = GetDeclaration(fullpath);
        const dirDec = demandType ?? dec.dirDec;
        this.callerProject = dec.project;
        _path = fullpath;
        if (dec.fileDec == undefined || this.callerProject == undefined) {
            console.info(`'${_path}' is not valid file type for codeFileInfo.parseUrl`);
            return false;
        }
        else {
            this.allPathOf = PathBridge.Convert(_path, dec.dirDec, dec.fileDec, dirDec /*sourceType as any, GIVEN_PATH_TYPE*/);
            this.pathOf = this.allPathOf[dirDec];
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
//# sourceMappingURL=codeFileInfo.js.map