
import { CommonEvent } from "../global/commonEvent.js";
import { ProjectManage } from "../ipc/ProjectManage.js";
import { ProjectRowR } from "../ipc/enumAndMore.js";
import { nodeFn } from "../nodeFn.js";
import { CommonRow } from "./buildRow.js";
import { commonParser } from "./codefile/commonParser.js";
import { codeFileInfo } from "./codeFileInfo.js";
import { fileWatcher } from "./fileWatcher.js";
import { PathBridge } from "./pathBridge.js";
export interface SourceCodeNode {
    designerCode?: string,
    jsFileCode?: string,
    htmlCode?: string,
}

export class builder {
    private ignoreDirs: string[] = [];
    project: ProjectRowR;
    ROOT_DIR = '';
    private static INSTANCE: builder;
    static GetInstance() {
        return this.INSTANCE ?? new builder();
    }
    constructor() {
        if (builder.INSTANCE != undefined) { throw new Error(`SINGLE INSTANCE ONLY use instead builder`); }
        this.ROOT_DIR = nodeFn.path.resolve();
        this.project = ProjectManage.getInfoByProjectPath(this.ROOT_DIR);
        this.commonMng = new commonParser(this);
        this.filewatcher = new fileWatcher(this);
        this.filewatcher.init();
        const _this = this;
        this.project.config.developer.build.ignorePath.forEach(pth => {
            _this.addToIgnore(pth);
        });
    }
    projectDir: string = '';
    addToIgnore = (...pathlist: string[]) => {
        pathlist.forEach(p =>
            this.ignoreDirs.push(nodeFn.path.normalize(nodeFn.path.join(this.ROOT_DIR, p)))
        );
    }
    commonMng: commonParser;
    filewatcher: fileWatcher;
    Event = {
        onSelect_xName: new CommonEvent<(ele: HTMLElement, row: CommonRow) => void>()
    }
    async getAllDesignerXfiles() {
        let results = [];
        const rootPath = nodeFn.path.resolve();
        const ign = [nodeFn.path.join(rootPath, 'node_modules')];
        const pref = this.project.config.preference;
        const outExt = pref.dirDeclaration[pref.outDir]?.fileWisePath?.dynamicDesign?.extension;
        if (outExt == undefined) { throw new Error("!!!cant find output dynamic design file (.html.js) extension"); }
        await this.recursive(pref.outDir,
            (pth) => ign.findIndex(s => nodeFn.path.isSamePath(s, pth)) >= 0,
            async (fullpath) => {
                if (fullpath.endsWith(outExt))
                    results.push(fullpath);
            });
        return results;
    }
    async buildALL(onComplete = () => { }, _fillReplacerPath = true) {
        let _this = this;
        let prj = this.project;
        if (prj.config.env == 'release') return;
        const pref = this.project.config.preference;
        const dirDeclaration = pref.dirDeclaration[pref.srcDir];
        const fileWisePath = dirDeclaration.fileWisePath;
        const srcDeclareKey = pref.srcDir;
        const outDeclareKey = pref.outDir;
        const designerFileDeclaration = fileWisePath.designer;
        let designerPath = nodeFn.path.join(prj.projectPath, dirDeclaration.dirPath ?? '', designerFileDeclaration?.dirPath ?? '');

        if (nodeFn.fs.existsSync(designerPath)) {
            let codeExt = fileWisePath.code.extension;
            let designerExt = fileWisePath.designer.extension;
            /*if (prj.config.type == 'js') {
                designerExt = '.designer.js';
                codeExt = '.js';
            }*/
            await this.recursive(designerPath, undefined, async (pth) => {
                if (pth.endsWith(designerExt)) {
                    let _pthObj = PathBridge.Convert(pth, srcDeclareKey as any, 'designer')[srcDeclareKey];
                    let bothExist = nodeFn.fs.existsSync(_pthObj.code) && nodeFn.fs.existsSync(_pthObj.html);
                    if (!bothExist) {
                        console.log(`${_pthObj.designer} file deleted...`);
                        nodeFn.fs.rmSync(_pthObj.designer)
                    }
                }
            });
        }




        const outCodeExt = pref.dirDeclaration[pref.outDir].fileWisePath.dynamicDesign.extension;
        let demandFiles = await _this.getAllDesignerXfiles();
        for (let i = 0; i < demandFiles.length; i++) {
            let dfile = demandFiles[i];
            let outDynamicDesignFile = nodeFn.path.resolve(dfile);
            //let importUrl = nodeFn.url.pathToFileURL(fullpath);
            if (nodeFn.fs.existsSync(outDynamicDesignFile)) {
                try {
                    let content = (await import(outDynamicDesignFile))?.default();// new WrapperHelper(importUrl)
                    if (content != undefined) {
                        let cinfo = PathBridge.Convert(outDynamicDesignFile, outDeclareKey as any, 'dynamicDesign', srcDeclareKey as any)[srcDeclareKey];
                        nodeFn.fs.writeFileSync(cinfo["html"], content, undefined, 'binary');
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                
            }
        }



        let bpath = nodeFn.path.join(this.project.projectPath, this.project.config.developer.build.buildPath);
        await this.recursive(bpath, undefined, async (pth) => {
            await _this.checkFileState(pth);
        });
        this.commonMng.gen.generateFiles(this.commonMng.rows);
        onComplete();
        //if (this.filewatcher != undefined) this.filewatcher.startWatch();
    }
    _ignoreThis = (pth: string) => {
        return this.ignoreDirs.findIndex(s => {
            return nodeFn.path.isSamePath(s, pth)
        }) != -1;
    }
    /** @private */
    recursive = async (parentDir: string, /*ignoreDir = this.ignoreDirs,*/
        ignoreThis = this._ignoreThis,
        callback: (path: string) => Promise<void>) => {
        const _this = this;
        let DirectoryContents = nodeFn.fs.readdirSync(parentDir + '/');
        for (let i = 0, ilen = DirectoryContents.length; i < ilen; i++) {
            const file = DirectoryContents[i];
            let _path = nodeFn.path.join(parentDir, file);//["#toFilePath"]();
            if (nodeFn.fs.isDirectory(_path)) {
                if (ignoreThis(_path) == false)
                    await this.recursive(_path, ignoreThis, callback);
            } else {
                await callback(_path);
            }
        }
        // DirectoryContents.forEach(async (file: string) => {
        //     //let _path = pathInfo.cleanPath(parentDir + '/' + file);
        //     let _path = nodeFn.path.join(parentDir, file);//["#toFilePath"]();
        //     if (nodeFn.fs.isDirectory(_path)) {
        //         if (ignoreThis(_path) == false)
        //             await this.recursive(_path, ignoreThis, callback);
        //     } else {
        //         await callback(_path);
        //     }
        // });
    }

    /** @param {codeFileInfo} fInfo */
    async buildFiles(fInfos: codeFileInfo[], onComplete = () => { }) {

        if (this.project.config.env == 'release') return;
        setTimeout(async () => {
            this.commonMng.reset();
            for (let i = 0, ilen = fInfos.length; i < ilen; i++) {
                const fInfo = fInfos[i];
                if (nodeFn.fs.existsSync(fInfo.pathOf.html)) {
                    await this.checkFileState(fInfo.pathOf.html);
                    this.commonMng.gen.generateFiles(this.commonMng.rows);
                }
            }
            onComplete();
        }, 1);
    }

    async getOutputCode(fInfo: codeFileInfo, htmlContents: string): Promise<SourceCodeNode> {
        await this.checkFileState(fInfo.pathOf.html, htmlContents);
        let row = this.commonMng.rows[0];
        return {
            designerCode: this.commonMng.gen.getDesignerCode(row),
            jsFileCode: this.commonMng.gen.getJsFileCode(row)
        };
    }

    async checkFileState(filePath: string, htmlContents?: string) {
        if (filePath.endsWith('uc.html')) { //  IF USER CONTROL
            await this.commonMng.init(filePath, htmlContents);
        } else if (filePath.endsWith('tpt.html')) { //  IF TEMPLATE
            await this.commonMng.init(filePath, htmlContents);
        }
    }
}

