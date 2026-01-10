import { existsSync, readdirSync, readFileSync, stat, statSync, writeFileSync } from "fs";
import path from "path";
import url from "url";
import { GetUcConfig } from "./ipc/userConfigManage.js";
import { codeFileInfo } from "./build/codeFileInfo.js";
import { GetProject, IBuildDirectoryResult, ISourceFileTypeMap, ProjectRowBase, UserUCConfig } from "./ipc/enumAndMore.js";
import { PathBridge } from "./build/pathBridge.js";
import { ConfigFiller } from "./ipc/ConfigFiller.js";
import { DynamicToHtml, IHTMLxSource } from "./lib/WrapperHelper.js";
PathBridge.path = path as any;
PathBridge.url = url as any;
PathBridge.CheckAndSetDefault();
const filler = new ConfigFiller();
export async function buildHTML() {
    const projectPath = path.resolve();
    //const cfg = await GetUcConfig(projectPath);
    await filler.fill(projectPath);
    PathBridge.source = filler.ucConfigList;
    const config = filler.MAIN_CONFIG.config;
    const pref = config?.preference;
    const dec = pref?.dirDeclaration;
    const cinfList = await getAllDesignerXfiles();
    const cInfos = cinfList.cinfo;
    //const srcDirDec = dec[pref.srcDir]
    const messages = {
        generateOutputAndRetry: false
    }
     
    for (let index = 0; index < cInfos.length; index++) {
        const cinfo = cInfos[index];
        //if (cinfo.pathOf.html.includes('ledger$form')) debugger;

        let dynamicOutputPath = cinfo[pref.outDir].dynamicDesign;
        let dynamicOutputData = undefined as string;
        let hasDynamicOutput = existsSync(dynamicOutputPath);
        if (hasDynamicOutput) { 
            const dtodata = (await DToH(dynamicOutputPath));
            dynamicOutputData = dtodata?.htmlSource();
            dynamicOutputData = dynamicOutputData?.trim() ?? '';
            if (dynamicOutputData.length > 0)
                writeFileSync(cinfo[pref.srcDir].html, dynamicOutputData);

            //await this.commonMng.init(cinfo);
        } else {
            if (existsSync(cinfo[pref.srcDir].dynamicDesign)) {
                console.log('GENERATE `output` AND REBUILD DESINGER..');
            }
            //if (existsSync(cinfo.pathOf.html))
            //await this.commonMng.init(cinfo);
        }
    }
    // if (existsSync(designerPath)) {
    //     let codeExt = fileWisePath.code.extension;
    //     let designerExt = fileWisePath.designer.extension;

    //     await this.recursive(designerPath, undefined, async (pth) => {
    //         if (pth.endsWith(designerExt)) {
    //             let _pthObj = PathBridge.Convert(pth, pref.srcDir as any, 'designer')[pref.srcDir];
    //             let bothExist = nodeFn.fs.existsSync(_pthObj.code) && (nodeFn.fs.existsSync(_pthObj.html) || nodeFn.fs.existsSync(_pthObj.dynamicDesign));
    //             if (!bothExist) {
    //                 console.log(`${_pthObj.designer} file deleted...`);
    //                 nodeFn.fs.rmSync(_pthObj.designer)
    //             }
    //         }
    //     });
    // }

    //
}
buildHTML();
async function DToH(dynamicPath: string): Promise<IHTMLxSource> {
    return await DynamicToHtml(dynamicPath);
}
async function getAllDesignerXfiles() {
    const rtrn = {
        cinfo: [] as IBuildDirectoryResult[]
    };
    let results = [];
    const projectPath = path.resolve();
    const ign = [path.join(projectPath, 'node_modules')];
    const pref = filler.MAIN_CONFIG.config?.preference;
    const dec = pref?.dirDeclaration;
    const srcDec = dec[pref.srcDir];
    const srcFileDec = srcDec?.fileWisePath;
    const srcDynamicExt = srcFileDec?.dynamicDesign?.extension;
    const srcHtmlExt = srcFileDec?.html?.extension;
    if (srcDynamicExt == undefined) { console.log("!!! no dynamic design file (.html.js) "); }
    await recursive(path.join(projectPath, srcDec.dirPath),
        (pth) => ign.findIndex(s => isSamePath(pth, s)) != -1,
        async (fullpath) => {
            const extCode = codeFileInfo.getExtType(fullpath);
            if (extCode != 'none') {
                const isDynamicFile = fullpath.endsWith(srcDynamicExt);
                const isHtmlFile = fullpath.endsWith(srcHtmlExt);
                if (isDynamicFile || isHtmlFile) {
                    let fileDecInfo = await GetDeclaration(fullpath, filler.ucConfigList);
                    if (fileDecInfo.project != undefined) {
                        let allPath = PathBridge.Convert(fullpath, pref.srcDir as any, fileDecInfo.fileDec as any, fileDecInfo.dirDec as any);
                        if (allPath == undefined) return;
                        let pathOf: ISourceFileTypeMap = allPath[pref.srcDir];
                        if (pathOf == undefined || !existsSync(pathOf.code)) return;
                        if (rtrn.cinfo.findIndex(s => (
                            (isHtmlFile && s[pref.srcDir].html == pathOf.html) ||
                            (isDynamicFile && s[pref.srcDir].dynamicDesign == pathOf.dynamicDesign)
                        )
                        ) == -1) rtrn.cinfo.push(allPath);
                    }
                }
            }
        });
    return rtrn;
}
const _ignoreThis = (pth: string) => false
/** @private */
async function recursive(parentDir: string, /*ignoreDir = this.ignoreDirs,*/
    ignoreThis,
    callback: (path: string) => Promise<void>) {
    let DirectoryContents = readdirSync(parentDir + '/');
    for (let i = 0, ilen = DirectoryContents.length; i < ilen; i++) {
        const file = DirectoryContents[i];
        let _path = path.join(parentDir, file);//["#toFilePath"]();
        if (statSync(_path).isDirectory()) {
            if (ignoreThis != undefined && ignoreThis(_path) == false)
                await recursive(_path, ignoreThis, callback);
        } else {
            await callback(_path);
        }
    }
}

async function GetDeclaration(filepath: string, projectRows = filler.ucConfigList) {
    if (filepath.startsWith('file:///')) filepath = url.fileURLToPath(filepath);
    //console.log('before'); 
    //console.log(projectRows);
    let prj = GetProject(filepath, projectRows, url as any);

    const rtrn = {
        project: prj,
        dirDec: undefined as string,
        fileDec: undefined as string,
    }
    if (rtrn.project == undefined) {
        let res = await GetAliceInfoByPath(filepath, projectRows);
        if (res.project == undefined) return rtrn;
        rtrn.project = res.project;
        filepath = res.absolutePath;
    }
    const np = path;
    const projPath = rtrn.project.projectPath;
    const cfg = rtrn.project.config;
    const pref = cfg.preference;
    const dirDec = Object.entries(pref.dirDeclaration);
    for (const [k, ddn] of dirDec) {
        const joinedDDN = np.join(projPath, ddn.dirPath);
        if (startsWith(filepath, joinedDDN)) {
            rtrn.dirDec = k as any;
            const fileDec = Object.entries(ddn.fileWisePath);
            let isFileFound = false;
            for (const [j, fdn] of fileDec) {
                let ext = filepath.substring(filepath.length - fdn.extension.length);
                if (ext.toLowerCase() === fdn.extension.toLowerCase()) {
                    if (fdn.dirPath != '' && !startsWith(filepath, np.join(joinedDDN, fdn.dirPath))) continue;
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
function startsWith(thisPath: string, startWithThisPath: string) {
    const base = path.resolve(startWithThisPath).toLowerCase();
    const target = path.resolve(thisPath).toLowerCase();
    const relative = path.relative(base, target);
    return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}
function isSamePath(path1: string, path2: string) {
    const absA = path.resolve(path1);
    const absB = path.resolve(path2);
    return (path.normalize(absA) === path.normalize(absB));
}
async function GetAliceInfoByPath(filePath: string, projectRows = filler.ucConfigList) {
    const rtrn = {
        alias: undefined as string,
        rootPath: undefined as string,
        absolutePath: undefined as string,
        project: undefined as ProjectRowBase,
    }
    for (let index = 0; index < projectRows.length; index++) {
        const projectRow = projectRows[index];
        for (const [alias, relativeAliasPath] of Object.entries(projectRow.config.browser.importmap)) {
            if (filePath.startsWith(alias)) {
                const relativeFilePath = filePath.replace(alias, `/${relativeAliasPath}/`);
                const absoluteFilePath = path.normalize(path.join(projectRow.projectPath, relativeFilePath));
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