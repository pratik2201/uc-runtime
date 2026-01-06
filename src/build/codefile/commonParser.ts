import { ITemplatePathOptions } from "../../enumAndMore.js";
import { FilterContent } from "../../global/filterContent.js";
import { ATTR_OF } from "../../global/runtimeOpt.js";
import { SpecialExtEnum, ucUtil } from "../../global/ucUtil.js";
import { IBuildDirectory, IFileDeclaration, IUCConfigPreference } from "ipc/enumAndMore.js";
import { UserUCConfig } from "ipc/enumAndMore.js";
import { ProjectRowR } from "../../ipc/enumAndMore.js";
import { nodeFn } from "../../nodeFn.js";
import { Template } from "../../Template.js";
import { Usercontrol } from "../../Usercontrol.js";
import { builder } from "../builder.js";
import { codeOptionsBase, CommonRow, Control, DesignerOptionsBase, dynamicDesignerElementTree, ImportClassNode } from "../buildRow.js";
import { codeFileInfo } from "../codeFileInfo.js";
import { ScopeType, objectOpt } from "../common.js";
import { TemplateMaker } from "../regs/TemplateMaker.js";
import { commonGenerator } from "./commonGenerator.js";
import { ProjectManage } from "../../ipc/ProjectManage.js";
import { HTMLx, importHTMLts } from "../../lib/WrapperHelper.js";
export interface PathReplacementNode { findPath: string, replaceWith: string }

export class commonParser {
    generateNodes(htContent: string): string {
        let rtrn = '';
        const source = new dynamicDesignerElementTree();

        function walk(node: HTMLElement, src: dynamicDesignerElementTree, depth = 0) {
            // nodeType:
            // 1 = Element
            // 3 = Text
            // 8 = Comment
            if (node.nodeType === Node.ELEMENT_NODE) {
                src.nodeName = node.tagName;
                src.type = 'element';
                for (let attr of node.attributes) {
                    src.props[attr.name] = attr.value;
                }

                for (let child of node.childNodes) {
                    let childTree = new dynamicDesignerElementTree();
                    if (walk(child as HTMLElement, childTree, depth + 1) == true) {
                        src.children.push(childTree);
                    }
                }
                return true;
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue?.trim() ?? '';
                src.type = 'text';
                src.value = text;
                return text.length > 0;
            } else if (node.nodeType === Node.COMMENT_NODE) {
                let comment = node.nodeValue.trim();
                // console.log("Comment:", comment);
                src.type = 'text';
                if (comment.endsWith('?')) {
                    src.value = (comment.startsWith('?=') || comment.startsWith("?php")) ?
                        `<${comment}>` : `<!--${comment}-->`;
                } else src.value = `<!--${comment}-->`;
                return true;
            }

            return false;
        }
        let mainele = htContent["#$"]();
        walk(mainele, source);
        let c = this.gen.filex('ts', '.uc', '.dynamicByHtml')(source);
        return c;
    }
    reset() {
        this.rows.length = 0;
        this.pathReplacement.length = 0;
    }
    rows: CommonRow[] = [];
    pathReplacement: PathReplacementNode[] = [];
    pushReplacement({ findPath = '', replaceWith = "" }: PathReplacementNode) {
        let index = this.pathReplacement.findIndex(s => ucUtil.equalIgnoreCase(s.findPath, findPath));
        if (index == -1) this.pathReplacement.push({ findPath: findPath, replaceWith: replaceWith });
        else this.pathReplacement[index].replaceWith = replaceWith;
        //console.log(this.pathReplacement);

    }
    bldr: builder;
    gen: commonGenerator;
    SRC_DEC: Partial<{
        code: IFileDeclaration;
        designer: IFileDeclaration;
        html: IFileDeclaration;
        scss: IFileDeclaration;
    }> = {};
    OUT_DEC: Partial<{
        code: IFileDeclaration;
        designer: IFileDeclaration;
        html: IFileDeclaration;
        scss: IFileDeclaration;
    }> = {};
    SRC_CODE_EXT: string;
    OUT_CODE_EXT: string;
    dynamicTemplate: Function;
    constructor(bldr: builder) {
        this.bldr = bldr;
        this.gen = new commonGenerator();
        this.project = this.bldr.project;
        this.CONFIG = this.project?.config;
        this.PREFERENCE = this.CONFIG?.preference;
        this.SRC_DEC = this.PREFERENCE?.dirDeclaration[this.PREFERENCE?.srcDir]?.fileWisePath as any;
        this.OUT_DEC = this.PREFERENCE?.dirDeclaration[this.PREFERENCE?.outDir]?.fileWisePath as any;
        this.SRC_CODE_EXT = this.SRC_DEC.code.extension;
        this.OUT_CODE_EXT = this.OUT_DEC.code.extension;
        //this.UC_BUILDER_DIRECTORY = this.project.aliceToPath['ucbuilder/'];
        //this.UC_BUILDER_ALICE = this.project.pathToAlice[this.UC_BUILDER_DIRECTORY];
        this.PROJECT_PATH_LENGTH = this.project.projectPath.length;

        this.UC_CONFIG = ProjectManage.getInfoByProjectPath(nodeFn.path.join(nodeFn.path.resolve(), './node_modules/ucbuilder'))?.config;
    }
    /** for getting project type of ucbuilder project */
    UC_CONFIG: UserUCConfig;
    CONFIG: UserUCConfig;
    //UC_BUILDER_DIRECTORY = "";
    //UC_BUILDER_ALICE = "";
    PREFERENCE: IUCConfigPreference;
    project: ProjectRowR;
    PROJECT_PATH_LENGTH = 0;
    async init(filePath: string, htmlContents: string | undefined = undefined) {
        let row = await this.fill(filePath, htmlContents);
        if (row != undefined)
            this.rows.push(row);
    }

    tmaker = new TemplateMaker('');
    //aliceMng = new AliceManager();
    _filterText = new FilterContent();
    codeHT: HTMLElement;
    // fill(filePath: string, htmlContents: string | undefined = undefined): CommonRow {
    //     let _row = new CommonRow();
    //     let _this = this;

    //     _row.src = new codeFileInfo(codeFileInfo.getExtType(filePath));
    //     if (!_row.src.parseUrl(filePath, filePref.srcDir, this.project.importMetaURL)) return undefined;
    //     let onSelect_xName = _this.bldr.Event.onSelect_xName;
    //     let projectPath = nodeFn.path.resolve();

    //     let tsToDes = nodeFn.path.relativeFilePath(_row.src.pathOf.code, _row.src.pathOf.designer);
    //     let DestoTs = nodeFn.path.relativeFilePath(_row.src.pathOf.designer, _row.src.pathOf.code);

    //     _row.codeFilePath = ucUtil.changeExtension(DestoTs, '.ts', '.js')["#toFilePath"]();
    //     _row.designerFilePath = ucUtil.changeExtension(tsToDes, '.ts', '.js')["#toFilePath"]();

    //     let code = htmlContents ??
    //         nodeFn.fs.existsSync(_row.src.pathOf.html, _row.src.projectInfo.importMetaURL) ?
    //         nodeFn.fs.readFileSync(_row.src.pathOf.html, undefined, _row.src.projectInfo.importMetaURL, false) : undefined;
    //     if (code == undefined) return undefined;
    //     code = code["#devEsc"]();
    //     // console.log('--------------------------');
    //     //console.log(filePath);

    //     this.tmaker.mainImportMeta = nodeFn.url.pathToFileURL(filePath);
    //     // console.log(this.tmaker.mainImportMeta);
    //     //let cccodeCallback = this.tmaker.compileTemplate(code);
    //     //code = cccodeCallback();
    //     let compileedCode = code;
    //     let rootpath = nodeFn.path.relative(projectPath, filePath);
    //     let isUserControl = _row.src.extCode == SpecialExtEnum.uc;
    //     try {
    //         if (compileedCode.trim() != '') {
    //             if (isUserControl) {
    //                 let cccodeCallback = this.tmaker.compileTemplate(compileedCode);
    //                 compileedCode = cccodeCallback();
    //             }
    //             compileedCode = ucUtil.PHP_REMOVE(code);
    //             this.codeHT = compileedCode["#$"]();
    //             _row.htmlFileContent = code;
    //         } else {
    //             if (isUserControl) {
    //                 code = `<wrapper x-caption="${_row.src.name}" tabindex="0">
    //                             <!-- DONT MODIFY "x-at" ATTRIBUTE -->
    //                         </wrapper>`;
    //             } else {
    //                 code = `<x:template    >
    //                     <wrapper id="primary"></wrapper>
    //                     <wrapper id="header"></wrapper>
    //                     <wrapper id="footer"></wrapper>
    //                 </x:template>`;
    //             }
    //             this.codeHT = code["#$"]() as HTMLElement;

    //             _row.htmlFileContent = code;
    //         }
    //     } catch (ex) {
    //         console.log(ex);

    //         return undefined;
    //     }
    //     _row.codefile.className = _row.src.name;
    //     _row.designer.className = `${_row.codefile.className}$Designer`;
    //     let DESIGNER_DIR_PATH = nodeFn.path.dirname(_row.src.pathOf.designer);
    //     let _ts = ucUtil.cleanNodeModulesPath(nodeFn.path.relative(DESIGNER_DIR_PATH, _row.src.pathOf.code))["#toFilePath"]();
    //     _row.codeFilePath = ucUtil.changeExtension(_ts, '.ts', '.js');
    //     _row.htmlFilePath = ucUtil.changeExtension(_ts, '.ts', '.html');
    //     if (!isUserControl) {
    //         switch (this.UC_CONFIG?.exports ?? this.CONFIG.exports) {
    //             case "import":
    //                 _row.designer.importer.addImport(['Template', 'TemplateNode'], this.nc('./node_modules/ucbuilder/out/Template.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['intenseGenerator'], this.nc('./node_modules/ucbuilder/out/intenseGenerator.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['ITptOptions'], this.nc('./node_modules/ucbuilder/out/enumAndMore.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['VariableList'], this.nc('./node_modules/ucbuilder/out/StylerRegs.js', DESIGNER_DIR_PATH));
    //                 break;
    //             case "types":
    //                 _row.designer.importer.addImport(['Template', 'TemplateNode'], 'ucbuilder/Template');
    //                 _row.designer.importer.addImport(['intenseGenerator'], 'ucbuilder/intenseGenerator');
    //                 _row.designer.importer.addImport(['ITptOptions'], 'ucbuilder/enumAndMore');
    //                 _row.designer.importer.addImport(['VariableList'], 'ucbuilder/StylerRegs');
    //                 break;
    //         }

    //         _row.baseClassName = Template.name;
    //         let subTemplates: ITemplatePathOptions[];
    //         if (_row.htmlFileContent == undefined)
    //             subTemplates = Template.GetArrayOfTemplate(_row.src);
    //         else {
    //             let tob = Template.GetOptionsByContent(_row.htmlFileContent,
    //                 _this.gen.filex('ts', '.tpt', '.style'),
    //                 undefined, nodeFn.url.pathToFileURL(_row.src.pathOf.scss));
    //             subTemplates = Object.values(tob.tptObj);
    //         }
    //         let tpts = _row.designer.templetes;
    //         subTemplates.forEach(template => {
    //             let rolelwr = template.accessKey;
    //             if (tpts.findIndex(s => ucUtil.equalIgnoreCase(s.name, rolelwr)) != -1) return;
    //             let controls: Control[] = [];
    //             if (template.htmlContents == '' || template.htmlContents == undefined) {
    //                 //debugger;
    //                 template.htmlContents = `<wrapper   x-at="${rootpath}"  >
    //                 <!-- DONT MODIFY "x-at" ATTRIBUTE FROM PRIMARY FILE -->
    //                 </wrapper>`;
    //             }
    //             let cntHT = template.htmlContents["#PHP_REMOVE"]()["#$"]() as HTMLElement;
    //             if (cntHT['length'] != undefined) cntHT = cntHT[0];
    //             const elements = Array.from(cntHT.querySelectorAll(`[${ATTR_OF.X_NAME}]`));
    //             for (let i = 0, iObj = elements, len = iObj.length; i < len; i++) {
    //                 const element = iObj[i];
    //                 onSelect_xName.fire([element as HTMLElement, _row]);
    //                 let scope = element.getAttribute(ATTR_OF.SCOPE_KEY) as ScopeType;
    //                 if (scope == undefined)
    //                     scope = 'public';
    //                 let _generic = element.getAttribute('x-generic');
    //                 _generic = _generic == null ? '' : '<' + _generic + '>';
    //                 let ctr = Object.assign(new Control(), {
    //                     name: element.getAttribute("x-name"),
    //                     nodeName: element.nodeName,
    //                     generic: _generic,
    //                     proto: objectOpt.getClassName(element),
    //                     scope: scope,
    //                 });
    //             }
    //             tpts.push({
    //                 name: template.accessKey,
    //                 scope: "public",
    //                 controls: controls
    //             });
    //         });
    //     } else {
    //         _row.baseClassName = Usercontrol.name;
    //         //let outHT = code["#devEsc"]()["#PHP_REMOVE"]()["#$"]() as HTMLElement;

    //         const elements = Array.from(this.codeHT.querySelectorAll(`[${ATTR_OF.X_NAME}]`));
    //         let accessKeys = `"` + Array.from(this.codeHT.querySelectorAll(`[${ATTR_OF.ACCESSIBLE_KEY}]`))
    //             .map(s => s.getAttribute(ATTR_OF.ACCESSIBLE_KEY))
    //         ["#distinct"]().join(`" | "`) + `"`;
    //         _row.designer.getterFunk = accessKeys;
    //         let im = _row.designer.importer.classes;
    //         switch (this.UC_CONFIG?.exports ?? this.CONFIG.exports) {
    //             case "import":
    //                 _row.designer.importer.addImport(['Usercontrol'], this.nc('./node_modules/ucbuilder/out/Usercontrol.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['intenseGenerator'], this.nc('./node_modules/ucbuilder/out/intenseGenerator.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['IUcOptions'], this.nc('./node_modules/ucbuilder/out/enumAndMore.js', DESIGNER_DIR_PATH));
    //                 _row.designer.importer.addImport(['VariableList'], this.nc('./node_modules/ucbuilder/out/StylerRegs.js', DESIGNER_DIR_PATH));
    //                 break;
    //             case "types":
    //                 _row.designer.importer.addImport(['Usercontrol'], 'ucbuilder/Usercontrol');
    //                 _row.designer.importer.addImport(['intenseGenerator'], 'ucbuilder/intenseGenerator');
    //                 _row.designer.importer.addImport(['IUcOptions'], 'ucbuilder/enumAndMore');
    //                 _row.designer.importer.addImport(['VariableList'], 'ucbuilder/StylerRegs');
    //                 break;
    //         }

    //         for (let i = 0, iObj = elements, len = iObj.length; i < len; i++) {
    //             const element = iObj[i];
    //             onSelect_xName.fire([element as HTMLElement, _row]);
    //             let nameAttr = element.getAttribute(ATTR_OF.X_NAME);
    //             let nodeName = element.nodeName;
    //             let scope = element.getAttribute(ATTR_OF.SCOPE_KEY) as ScopeType;
    //             if (scope == undefined)
    //                 scope = 'public';
    //             let proto = Object.getPrototypeOf(element).constructor.name;
    //             let _generic = element.getAttribute('x-generic');
    //             _generic = _generic == null ? '' : '<' + _generic + '>';
    //             if (element.hasAttribute("x-from")) {
    //                 let _subpath = element.getAttribute("x-from")["#devEsc"]();
    //                 _subpath = nodeFn.path.resolveFilePath(filePath, _subpath);//["#toFilePath"]();
    //                 let uFInf = new codeFileInfo(codeFileInfo.getExtType(_subpath));
    //                 uFInf.parseUrl(_subpath, filePref.srcDir, filePath);
    //                 if (nodeFn.fs.existsSync(uFInf.pathOf.code) ||
    //                     nodeFn.fs.existsSync(uFInf.pathOf.html) ||
    //                     nodeFn.fs.existsSync(uFInf.pathOf.designer)) {
    //                     let ctrlNode = Object.assign(new Control(), {
    //                         name: nameAttr,
    //                         proto: proto,
    //                         generic: _generic,
    //                         scope: scope,
    //                         type: uFInf.extCode,
    //                         nodeName: uFInf.name,
    //                         src: uFInf,
    //                     });
    //                     let fullcodePath = uFInf.pathOf.code;
    //                     let nws = ucUtil.changeExtension(nodeFn.path.relativeFilePath(_row.src.pathOf.designer, fullcodePath), '.ts', '.js');
    //                     ctrlNode.codeFilePath = nws; //   oldone;
    //                     ctrlNode.importedClassName = _row.designer.importer.addImport([uFInf.name],
    //                         ctrlNode.codeFilePath)![0];
    //                     _row.designer.controls.push(ctrlNode);
    //                 }
    //             } else {
    //                 _row.designer.controls.push(Object.assign(new Control(), {
    //                     name: nameAttr,
    //                     proto: proto,
    //                     generic: _generic,
    //                     scope: scope,
    //                     type: 'none',
    //                     nodeName: nodeName,
    //                 }));
    //             }
    //         }
    //     }
    //     _row.designer.importer.addImport([_row.src.name], _row.codeFilePath);
    //     return _row;
    // }
    async fill(filePath: string, htmlContents: string | undefined = undefined): Promise<CommonRow> {
        let _row = new CommonRow();
        let _this = this;
        let ext = codeFileInfo.getExtType(filePath);
        switch (ext) {
            case '.uc': await this.fillUc(filePath, htmlContents, _row); return _row;
            case '.tpt': await this.fillTpt(filePath, htmlContents, _row); return _row;
            default: return undefined;
        }
        //_row.src = new codeFileInfo(codeFileInfo.getExtType(filePath));
        //if (!_row.src.parseUrl(filePath, filePref.srcDir, this.project.importMetaURL)) return undefined;
    }

    fillUc = async (filePath: string, htmlContents: string, _row: CommonRow) => {
        let row = _row.sources['ts_uc'];
        let _this = this;
        _row.src = new codeFileInfo();
        const finfo = _row.src;
        if (!finfo.parseUrl(filePath, _this.PREFERENCE.srcDir, this.project.importMetaURL)) return undefined;
        let onSelect_xName = _this.bldr.Event.onSelect_xName;

        let code: string;
        const pathOf = finfo.pathOf;
        const filePref = finfo?.projectInfo?.config?.preference;
        /*if (nodeFn.fs.existsSync(pathOf.dynamicDesign + 'c') == true) {
            nodeFn.fs.rmSync(pathOf.dynamicDesign);
            nodeFn.fs.rmSync(pathOf.dynamicDesign + 'c'); 
            return undefined;
        }*/
        if (htmlContents == undefined && pathOf.dynamicDesign != undefined) {
            if (nodeFn.fs.existsSync(pathOf.dynamicDesign)) {
                row.designer.dynamicName = row.designer.importer.getNameNumber(`${finfo.name}$dynamicHtmlCode`);
                code = await importHTMLts(finfo.allPathOf[filePref.outDir].dynamicDesign);
            } else {
                if (nodeFn.fs.existsSync(pathOf.html)) {
                    let htcontent = nodeFn.fs.readFileSync(pathOf.html);
                    const dynamicCode = this.generateNodes(htcontent);
                    if (dynamicCode != undefined && dynamicCode.length > 0) {
                        code = htcontent;
                        _row.dynamicFileContentx = dynamicCode;
                    }

                }
            }
        } else {
            console.warn('DYNAMIC DESIGN NOT LOADED :' + finfo.allPathOf[filePref.outDir].dynamicDesign);
        }


        code = htmlContents ?? code ??
            (nodeFn.fs.existsSync(pathOf.html) ?
                nodeFn.fs.readFileSync(pathOf.html) : undefined);
        if (code == undefined) return undefined;
        code = ucUtil.devEsc(code);

        this.tmaker.mainImportMeta = nodeFn.url.pathToFileURL(filePath);
        let compileedCode = code;
        try {

            if (compileedCode.trim() != '') {
                let cccodeCallback = this.tmaker.compileTemplate(compileedCode);
                compileedCode = ucUtil.PHP_REMOVE(cccodeCallback({}));
                this.codeHT = compileedCode["#$"]();
                _row.htmlFileContent = code;
            } else {
                code = HTMLx.Wrapper([{ "x-caption": 'Form' }]);
                this.codeHT = code["#$"]() as HTMLElement;
                _row.dynamicFileContent = commonGenerator.readTemplate('ts', '.uc', '.dynamic');
            }
        } catch (ex) {
            console.log(ex);
            return undefined;
        }

        row.designer.baseClassName = Usercontrol.name;
        this.common1(row.designer, row.code, _row.src);
        //let outHT = code["#devEsc"]()["#PHP_REMOVE"]()["#$"]() as HTMLElement;

        const elements = Array.from(this.codeHT.querySelectorAll(`[${ATTR_OF.X_NAME}]`));
        const elementsXfrom = Array.from(this.codeHT.querySelectorAll(`[${ATTR_OF.X_FROM}]`))
            .filter(s => !elements.includes(s));
        let accessKeys = `"` + ucUtil.distinct(Array.from(this.codeHT.querySelectorAll(`[${ATTR_OF.ACCESSIBLE_KEY}]`))
            .map(s => s.getAttribute(ATTR_OF.ACCESSIBLE_KEY))).join(`" | "`) + `"`;

        row.designer.getterFunk = accessKeys;
        //let im = row.designer.importClasses;
        const _importer = row.designer.importer;
        switch (this.UC_CONFIG?.exports ?? this.CONFIG.exports) {
            case "import":
                _importer.addImport(['Usercontrol'], this.nc('./node_modules/ucbuilder/out/Usercontrol.js', pathOf.designer));
                _importer.addImport(['intenseGenerator'], this.nc('./node_modules/ucbuilder/out/intenseGenerator.js', pathOf.designer));
                _importer.addImport(['IUcOptions'], this.nc('./node_modules/ucbuilder/out/enumAndMore.js', pathOf.designer));
                _importer.addImport(['VariableList'], this.nc('./node_modules/ucbuilder/out/StylerRegs.js', pathOf.designer));
                break;
            case "types":
                _importer.addImport(['Usercontrol'], 'ucbuilder/Usercontrol');
                _importer.addImport(['intenseGenerator'], 'ucbuilder/intenseGenerator');
                _importer.addImport(['IUcOptions'], 'ucbuilder/enumAndMore');
                _importer.addImport(['VariableList'], 'ucbuilder/StylerRegs');
                break;
        }
        const _exists = nodeFn.fs.existsSync;
        for (let i = 0, iObj = elements, len = iObj.length; i < len; i++) {
            const element = iObj[i];
            onSelect_xName.fire([element as HTMLElement, _row]);
            const ctr = new Control();
            ctr.name = element.getAttribute(ATTR_OF.X_NAME);
            ctr.nodeName = element.nodeName;
            ctr.scope = element.getAttribute(ATTR_OF.SCOPE_KEY) ?? 'public' as any;
            ctr.proto = Object.getPrototypeOf(element).constructor.name;
            ctr.generic = element.getAttribute('x-generic');
            ctr.generic = ctr.generic == null ? undefined : `<${ctr.generic}>`;
            ctr.type = 'none';
            if (element.hasAttribute("x-from")) {
                let _subpath = ucUtil.devEsc(element.getAttribute("x-from"));
                _subpath = nodeFn.path.resolveFilePath(filePath, _subpath);//["#toFilePath"]();
                let uFInf = new codeFileInfo();
                uFInf.parseUrl(_subpath, filePref.srcDir, filePath);
                if (_exists(uFInf.pathOf.code) || _exists(uFInf.pathOf.dynamicDesign) ||
                    _exists(uFInf.pathOf.scss) || _exists(uFInf.pathOf.html)) {
                    ctr.type = uFInf.extCode;
                    ctr.nodeName = uFInf.name;
                    ctr.src = uFInf;
                    let fullcodePath = uFInf.pathOf.code;
                    let nws = ucUtil.changeExtension(nodeFn.path.relativeFilePath(pathOf.designer, fullcodePath), '.ts', '.js');
                    ctr.codeFilePath = nws; //   oldone;
                    ctr.importedClassName = row.designer.importer.addImport([uFInf.name], ctr.codeFilePath)[0];
                    row.designer.controls.push(ctr);
                }
            } else row.designer.controls.push(ctr);

        }

        row.designer.importer.addImport([finfo.name], row.designer.codeFilePath);
    }

    fillTpt = async (filePath: string, htmlContents: string, _row: CommonRow) => {
        let row = _row.sources['ts_tpt'];
        let _this = this;
        _row.src = new codeFileInfo();
        const finfo = _row.src;
        if (!finfo.parseUrl(filePath, _this.PREFERENCE.srcDir, this.project.importMetaURL)) return undefined;

        const filePref = finfo?.projectInfo?.config?.preference;
        let onSelect_xName = _this.bldr.Event.onSelect_xName;
        let projectPath = nodeFn.path.resolve();

        let code: string;
        const pathOf = finfo.pathOf;
        if (htmlContents == undefined && pathOf.dynamicDesign != undefined && nodeFn.fs.existsSync(pathOf.dynamicDesign)) {
            row.designer.dynamicName = row.designer.importer.getNameNumber(`${finfo.name}$dynamicHtmlCode`);
            code = await importHTMLts(finfo.allPathOf[filePref.outDir].dynamicDesign);
        } else {
            console.warn('DYNAMIC DESIGN NOT LOADED :' + finfo.allPathOf[filePref.outDir].dynamicDesign);
        }

        code = htmlContents ?? code ??
            nodeFn.fs.existsSync(pathOf.html) ?
            nodeFn.fs.readFileSync(pathOf.html) : undefined;
        if (code == undefined) return undefined;
        code = ucUtil.devEsc(code);
        this.tmaker.mainImportMeta = nodeFn.url.pathToFileURL(filePath);
        let compileedCode = code;
        let rootpath = nodeFn.path.relative(projectPath, filePath);
        try {
            if (compileedCode.trim() != '') {
                compileedCode = ucUtil.PHP_REMOVE(code);
                this.codeHT = compileedCode["#$"]();
                _row.htmlFileContent = code;
            } else {
                // code = `
                //     <x:template>
                //         <wrapper id="primary"></wrapper>
                //         <wrapper id="header"></wrapper>
                //         <wrapper id="footer"></wrapper>
                //     </x:template>
                //     `;
                code = HTMLx.Template({
                    primary: {},
                    header: {},
                    footer: {},
                });
                this.codeHT = code["#$"]() as HTMLElement;
                _row.dynamicFileContent = commonGenerator.readTemplate('ts', '.tpt', '.dynamic');
                _row.htmlFileContent = code;
            }
        } catch (ex) {
            console.log(ex);

            return undefined;
        }
        this.common1(row.designer, row.code, _row.src);
        row.designer.baseClassName = Template.name;

        switch (this.UC_CONFIG?.exports ?? this.CONFIG.exports) {
            case "import":
                row.designer.importer.addImport(['Template', 'TemplateNode'], this.nc('./node_modules/ucbuilder/out/Template.js', pathOf.designer));
                row.designer.importer.addImport(['intenseGenerator'], this.nc('./node_modules/ucbuilder/out/intenseGenerator.js', pathOf.designer));
                row.designer.importer.addImport(['ITptOptions'], this.nc('./node_modules/ucbuilder/out/enumAndMore.js', pathOf.designer));
                row.designer.importer.addImport(['VariableList'], this.nc('./node_modules/ucbuilder/out/StylerRegs.js', pathOf.designer));
                break;
            case "types":
                row.designer.importer.addImport(['Template', 'TemplateNode'], 'ucbuilder/Template');
                row.designer.importer.addImport(['intenseGenerator'], 'ucbuilder/intenseGenerator');
                row.designer.importer.addImport(['ITptOptions'], 'ucbuilder/enumAndMore');
                row.designer.importer.addImport(['VariableList'], 'ucbuilder/StylerRegs');
                break;
        }

        row.designer.baseClassName = Template.name;

        let subTemplates: ITemplatePathOptions[];
        if (_row.htmlFileContent == undefined)
            subTemplates = Template.GetArrayOfTemplate(finfo);
        else {
            let tob = Template.GetOptionsByContent(_row.htmlFileContent,
                commonGenerator.readTemplate('ts', '.tpt', '.style'),
                undefined, nodeFn.url.pathToFileURL(pathOf.scss));
            subTemplates = Object.values(tob.tptObj);
        }
        let tpts = row.designer.templetes;
        subTemplates.forEach(template => {
            let rolelwr = template.accessKey;
            if (tpts.findIndex(s => ucUtil.equalIgnoreCase(s.name, rolelwr)) != -1) return;
            let controls: Control[] = [];
            if (template.htmlContents == '' || template.htmlContents == undefined) {
                //debugger;
                template.htmlContents = `
                <wrapper   x-at="${rootpath}"  >
                    <!-- DONT MODIFY "x-at" ATTRIBUTE FROM PRIMARY FILE -->
                </wrapper>
                    `;
            }
            let cntHT = template.htmlContents["#PHP_REMOVE"]()["#$"]() as HTMLElement;
            if (cntHT['length'] != undefined) cntHT = cntHT[0];
            const elements = Array.from(cntHT.querySelectorAll(`[${ATTR_OF.X_NAME}]`));
            for (let i = 0, iObj = elements, len = iObj.length; i < len; i++) {
                const element = iObj[i];
                onSelect_xName.fire([element as HTMLElement, _row]);
                let scope = element.getAttribute(ATTR_OF.SCOPE_KEY) as ScopeType;
                if (scope == undefined)
                    scope = 'public';
                let _generic = element.getAttribute('x-generic');
                _generic = _generic == null ? '' : '<' + _generic + '>';
                let ctr = Object.assign(new Control(), {
                    name: element.getAttribute("x-name"),
                    nodeName: element.nodeName,
                    generic: _generic,
                    proto: objectOpt.getClassName(element),
                    scope: scope,
                });
            }
            tpts.push({
                name: template.accessKey,
                scope: "public",
                controls: controls
            });
        });
        //}
        row.designer.importer.addImport([finfo.name], row.designer.codeFilePath);
    }
    common1 = (des: DesignerOptionsBase, code: codeOptionsBase, finfo: codeFileInfo) => {
        const pathOf = finfo.pathOf;

        code.className = finfo.name;
        des.className =
            code.designerClassName = `${finfo.name}$Designer`;



        if (pathOf.dynamicDesign != undefined) {
            let dsTodyn = ucUtil.resolveSubNode(nodeFn.path.relativeFilePath(pathOf.designer, pathOf.dynamicDesign));
            des.dynamicFilePath = ucUtil.changeExtension(dsTodyn, this.SRC_CODE_EXT, this.OUT_CODE_EXT);
        }
        if (pathOf.html != undefined) {
            let dsToht = ucUtil.resolveSubNode(nodeFn.path.relativeFilePath(pathOf.designer, pathOf.html));
            des.htmlFilePath = dsToht;
        }
        if (pathOf.code != undefined) {
            let dsTocd = ucUtil.resolveSubNode(nodeFn.path.relativeFilePath(pathOf.designer, pathOf.code));
            des.codeFilePath = ucUtil.changeExtension(dsTocd, this.SRC_CODE_EXT, this.OUT_CODE_EXT);
            let tsToDes = ucUtil.resolveSubNode(nodeFn.path.relativeFilePath(pathOf.code, pathOf.designer));
            code.designerFilePath = ucUtil.changeExtension(tsToDes, this.SRC_CODE_EXT, this.OUT_CODE_EXT);
        }

    }
    nc(_path: string, fromFilePath: string) {
        let fpath = nodeFn.path.join(nodeFn.path.resolve(), _path);
        return ucUtil.resolveSubNode(nodeFn.path.relativeFilePath(fromFilePath, fpath))["#toFilePath"]();
    }
    fillDefImports(name: string, url: string, classList: ImportClassNode[], ctrlNode?: Control)/*: number */ {
        let _urlLowerCase = url.toLowerCase();
        let _import = classList.find(s => s.url.toLowerCase() == _urlLowerCase);
        if (ctrlNode != undefined) ctrlNode.importedClassName = name;
    }

}
