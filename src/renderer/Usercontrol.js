import { ExtractArguments, objectOpt } from "../common/enumAndMore.js";
import { GetUniqueId } from "../common/ipc/enumAndMore.js";
import { codeFileInfo } from "../global/codeFileInfo.js";
import { CommonEvent } from "../global/commonEvent.js";
import { ATTR_OF } from "../global/runtimeOpt.js";
import { TemplateMaker } from "../global/TemplateMaker.js";
import { ucUtil } from "../global/ucUtil.js";
import { FilterContent, STYLER_SELECTOR_TYPE, SourceNode } from "../lib/StampGenerator.js";
import { TabIndexManager } from "../lib/TabIndexManager.js";
import { WinManager } from "../lib/WinManager.js";
import { nodeFn } from "./nodeFn.js";
import { CssVariableHandler, StyleBaseType } from "./StylerRegs.js";
export class Usercontrol {
    static guid;
    static MATERIAL = {
        htmlContents: undefined,
        cssContents: undefined,
    };
    static parse(node) { return node["#data"](ATTR_OF.BASE_OBJECT); }
    static Resolver = (outDesignerImportMetaUrl, relPathOfOutHtml) => {
        let fp = nodeFn.url.fileURLToPath(outDesignerImportMetaUrl); // `absFileUrl` designer js path
        return nodeFn.path.resolveFilePath(fp, relPathOfOutHtml);
    };
    static async GenerateControls(mainUc, args, htmlCodePath) {
        const mainFilePath = htmlCodePath;
        async function _tpt(xname, finfo, targetEle) {
            //let jsPath = ucUtil.changeExtension(nodeExp.path.resolveFilePath(mainFilePath, xfrom), '.html', 'js');
            let jsPath;
            jsPath = finfo.pathOf.code;
            let className = nodeFn.path.basename(jsPath).split('.')[0];
            let frmType = await import(jsPath)[className];
            mainUc[xname] = await frmType['CreateAsync']({
                parentUc: mainUc,
                accessName: "xname",
                elementHT: targetEle,
            });
        }
        async function _uc(xname, finfo, targetEle) {
            let jsPath;
            jsPath = finfo.pathOf.code; //ucUtil.changeExtension(nodeExp.path.resolveFilePath(mainFilePath, xfrom), '.html', '.js');
            let className = nodeFn.path.basename(jsPath).split('.')[0];
            let ft = await import(jsPath);
            let frmType = ft[className];
            if (frmType == undefined)
                debugger;
            mainUc[xname] = await frmType['CreateAsync']({
                parentUc: mainUc,
                mode: args.mode,
                accessName: xname,
                /*session: {
                    loadBySession: args.session.loadBySession,
                    uniqueIdentity: xname,
                    addNodeToParentSession: true,
                },*/
                // decisionForTargerElement: 'replace',
                targetElement: targetEle
            });
            const uc = mainUc[xname];
            uc.ucExtends.show({ decision: 'replace' });
        }
        const mainFinfo = args.cfInfo;
        const pref = args.cfInfo.projectInfo.config.preference;
        for (const [xname, htAr] of Object.entries(mainUc.ucExtends.controls)) {
            let ele = htAr;
            if (ele.hasAttribute('x-from')) {
                let xfrom = ele.getAttribute(ATTR_OF.X_FROM);
                let targetPath = nodeFn.path.resolveFilePath(mainFinfo.pathOf.html, xfrom);
                let finfo = new codeFileInfo();
                finfo.parseUrl(targetPath, pref.outDir, mainFinfo.pathOf.html);
                if (xfrom.endsWith('.uc.html'))
                    await _uc(xname, finfo, ele);
                else
                    await _tpt(xname, finfo, ele);
            }
            else
                mainUc[xname] = htAr;
        }
        // console.log(importMeta);
        //console.log(uc.ucExtends.controls);
    }
    static HiddenSpace = document.createElement('hspc' + GetUniqueId());
    static UcOptionsStc;
    static extractArgs = (args) => ExtractArguments(args);
    constructor() {
        //Usercontrol._CSS_VAR_STAMP++;
        //this.ucExtends.cssVarStampKey = 'u' + Usercontrol._CSS_VAR_STAMP;
    }
    hide = async () => {
        let _ext = this.ucExtends;
        let res = { prevent: false };
        _ext.visibility = 'hidden';
        if (_ext.isDialogBox)
            await WinManager.pop(this);
        Usercontrol.HiddenSpace.appendChild(_ext.wrapperHT);
        await _ext.Events.afterClose.fireAsync([this]); // _ext.Events.afterHide
    };
    destruct = async () => {
        let _this = this;
        let _ext = _this.ucExtends;
        await _ext.Events.onDestruction.fireAsync();
        if (_ext.isDialogBox)
            await WinManager.pop(_this);
        _ext.Events.afterClose.fireAsync([this]);
        await Usercontrol.HiddenSpace.appendChild(_ext.wrapperHT);
        await _ext.srcNode.release();
        requestAnimationFrame(async () => {
            _ext.wrapperHT["#delete"]();
            for (const key in _this) {
                _this[key] = undefined;
            }
        });
        return false;
    };
    static templateMkr = new Map();
    ucExtends = {
        get Context() { return this.dialogForm?.ucExtends.___META.CONTEXT; },
        set SetContext(context) {
            /*if (this.dialogForm.ucExtends != this) {
                this.dialogForm.ucExtends.SetContext(context);
            } else {
                this.___META.CONTEXT = context;
                this.Events.contextChange.fire([]);
            }*/
            let df = this.dialogForm.ucExtends;
            df.___META.CONTEXT = context;
            df.Events.contextChange.fire([]);
        },
        DialogResult: undefined,
        mode: 'client',
        ___META: {
            CONTEXT: undefined,
            PREV_CREATED_ID: undefined,
            PREV_UPDATED_ID: undefined,
            SELECTED_ID: undefined,
            CLOSE_ON_SAVE: undefined,
        },
        fileInfo: undefined,
        form: undefined,
        dialogForm: undefined,
        PARENT: undefined,
        // session: undefined as SessionManager,// new SessionManager(),
        srcNode: undefined,
        wrapperHT: undefined,
        isDialogBox: false,
        keepVisible: false,
        parentDependantIndex: -1,
        dependant: [],
        //HIDE_OR_CLOSE: 'close' as 'hide' | 'close',
        isForm: false,
        get formExtends() { return this.form.ucExtends; },
        get self() { return this.wrapperHT; },
        set caption(text) {
            this.designer.setCaption(text);
        },
        get caption() {
            return this.wrapperHT.getAttribute('x-caption');
        },
        lastFocuedElement: undefined,
        keepVisible_Till_I_Exist: (I) => {
            let _this = this;
            let vopt = this.ucExtends.keepVisible;
            this.ucExtends.keepVisible = true;
            I.ucExtends.Events.afterClose.on(() => {
                _this.ucExtends.keepVisible = vopt;
            });
        },
        find: (skey) => {
            let ar = skey.split(',');
            let _this = this.ucExtends;
            let uniqStamp = _this.srcNode.localStamp;
            ar = ar.map((s) => {
                s = FilterContent.select_inline_filter(s, uniqStamp);
                return s;
            });
            let nodeList = _this.self.querySelectorAll(ar.join(","));
            return Array.from(nodeList);
        },
        initalComponents: {
            targetElement: undefined,
            elements: undefined,
            stageHT: undefined,
            changeStage: (newStage) => {
                let ucExt = this.ucExtends;
                if (!this.ucExtends.wrapperHT.contains(newStage))
                    return false;
                let initCompo = ucExt.initalComponents;
                let arL = Array.from(initCompo?.elements ?? []);
                let ctrls = [];
                for (let index = 0, len = arL.length; index < len; index++) {
                    const node = arL[index];
                    if (!node.contains(newStage)) {
                        newStage.appendChild(node);
                    }
                }
                initCompo.stageHT = newStage;
                return true;
            }
        },
        setCssVariable: (varList, scope) => {
            let styler = this.ucExtends.srcNode.styler;
            switch (scope) {
                case 'global':
                    CssVariableHandler.SetCSSVarValue(varList, '' + styler.KEYS.LOCAL, "g");
                    break;
                //case 'template': CssVariableHandler.SETVALUE(varList, styler.TEMPLATE_STAMP_KEY, "t", this.ucExtends.self); break;
                case 'local':
                    CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.LOCAL, "l", this.ucExtends.self);
                    break;
                case 'internal':
                    CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.INTERNAL, "i", this.ucExtends.self);
                    break; // StylerRegs.internalKey
            }
        },
        getCssVariable: (key, scope) => {
            let styler = this.ucExtends.srcNode.styler;
            switch (scope) {
                case 'global': return document.body.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, '' + styler.KEYS.ROOT, "g"));
                /*case 'template': return this.ucExtends.self.style.getPropertyValue(
                    CssVariableHandler.getKeyName(key, styler.TEMPLATE_STAMP_KEY, "t"));*/
                case 'local': return this.ucExtends.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.LOCAL, "l"));
                case 'internal': return this.ucExtends.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.INTERNAL, "i")); // StylerRegs.internalKey
                default: return '';
            }
        },
        cssVarStampKey: '0',
        initializecomponent: (param0) => {
            let ucExt = this.ucExtends;
            ucExt.mode = param0.mode;
            if (param0.events.beforeInitlize != undefined)
                param0.events.beforeInitlize(this);
            ucExt.isForm = (param0.parentUc == undefined);
            ucExt.fileInfo = param0.cfInfo;
            if (ucExt.isForm) {
                ucExt.dialogForm = this;
                ucExt.show = () => { throw new Error('Parent Free Usercontrol SHOULD be CALL by `showDialog` \n ' + param0.cfInfo.pathOf.html); };
            }
            else {
                ucExt.dialogForm = param0.parentUc.ucExtends.dialogForm;
                ucExt.showDialog = () => { throw new Error('with Parent Usercontrol SHOULD be CALL by `show` \n ' + param0.cfInfo.pathOf.html); };
            }
            if (ucExt.isForm) {
                ucExt.dialogForm.ucExtends.___META.CONTEXT = param0.context;
            }
            ucExt.srcNode = SourceNode.registerSource({
                key: ucExt.fileInfo.pathOf.scss,
                cssKeyStamp: param0.cssKeyStamp,
                cssFilePath: param0.source.cssFilePath ?? ucExt.fileInfo.pathOf.scss,
                accessName: param0.accessName,
                project: ucExt.fileInfo.projectInfo,
                baseType: StyleBaseType.UserControl,
                mode: '^',
            });
            let htPathToRead = param0.source.htmlFilePath ?? ucExt.fileInfo.pathOf.html;
            let htContent = param0.source.htmlContents;
            let tmkr = Usercontrol.templateMkr.get(htPathToRead);
            if (tmkr == undefined) {
                let t = new TemplateMaker(htPathToRead);
                tmkr = t.compileTemplate(htContent)(param0.source.htmlRow ?? {});
                Usercontrol.templateMkr.set(htPathToRead, tmkr);
            }
            let isAlreadyExist = ucExt.srcNode.htmlCode.load(tmkr);
            if (!isAlreadyExist)
                ucExt.srcNode.loadHTML();
            ucExt.wrapperHT = ucExt.srcNode.dataHT.cloneNode(true);
            if (ucExt.isForm) {
                ucExt.PARENT = this;
                ucExt.form = this;
                ucExt.srcNode.config({
                    parentUc: ucExt.PARENT,
                    parentSrc: ucExt.fileInfo.projectInfo.stampSRC,
                    wrapper: ucExt.wrapperHT,
                    key: ucExt.fileInfo.pathWithExt('html'),
                    accessName: param0.accessName
                });
            }
            else {
                ucExt.form = param0.parentUc.ucExtends.form;
                ucExt.PARENT = param0.parentUc;
                ucExt.srcNode.config({
                    parentUc: ucExt.PARENT,
                    parentSrc: ucExt.PARENT.ucExtends.srcNode,
                    wrapper: ucExt.wrapperHT,
                    key: ucExt.fileInfo.pathWithExt('html'),
                    accessName: param0.accessName
                });
                if (param0.targetElement) {
                    ucExt.initalComponents.elements = param0.targetElement.children;
                    objectOpt.copyAttr(param0.targetElement, ucExt.wrapperHT);
                    Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
                }
                else {
                    Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
                }
            }
            ucExt.initalComponents.targetElement = param0.targetElement;
            let pucExt = ucExt.PARENT.ucExtends;
            ucExt.wrapperHT["#data"](ATTR_OF.BASE_OBJECT, this);
            if (!ucExt.isForm) {
                ucExt.parentDependantIndex = pucExt.dependant.length;
                pucExt.dependant.push(this);
            }
            ucExt.controls = ucExt.passElement(ucExt.wrapperHT, { skipTopEle: true }); //.children
            let sizeChangeEvt = ucExt.Events.sizeChanged;
            sizeChangeEvt.Events.onChangeEventList = () => {
                if (ucExt.resizerObserver == undefined) {
                    ucExt.resizerObserver = new ResizeObserver((cbpera) => {
                        sizeChangeEvt.fire([cbpera]);
                    });
                    ucExt.resizerObserver.observe(ucExt.wrapperHT);
                }
                else {
                    if (sizeChangeEvt.length == 0) {
                        ucExt.resizerObserver.disconnect();
                        ucExt.resizerObserver = undefined;
                    }
                }
            };
            /*ucExt.Events.activate.Events.onChangeEventList = () => {
                if (ucExt.Events.activate.onCounter == 1) {
                    ucExt.self.addEventListener("focusin", async (e) => {
                        await ucExt.Events.activate.fireAsync();
                    });
                }
            }*/
            ucExt.Events.onDestruction.on(() => {
                //if(ucExt.keepReference)
                for (let i = ucExt.dependant.length - 1; i >= 0; i--) {
                    ucExt.dependant[i]?.destruct();
                }
                pucExt.dependant[ucExt.parentDependantIndex] = undefined;
            });
            ucExt.Events.onDataExport = (data) => pucExt.Events.onDataExport(data);
            if (ucExt.dialogForm == undefined && pucExt.dialogForm != undefined)
                ucExt.dialogForm = pucExt.dialogForm;
            ucExt.initalComponents.stageHT = ucExt.wrapperHT;
            //ucExt.wrapperHT.setAttribute(ATTR_OF.UC.UC_STAMP+"__", ucExt.srcNode.uniqStamp);
            //console.log(ucExt.wrapperHT.children);
            ucExt.srcNode.setWrapper(ucExt.wrapperHT);
            //ucExt.wrapperHT.setAttribute(ATTR_OF.UC.ALL, ucExt.srcNode.uniqStamp);
            //ucExt.wrapperHT["#clearUcStyleClasses"]();
            //ucExt.wrapperHT.classList.add(ATTR_OF.__CLASS(ucExt.srcNode.uniqStamp, 'm'));
            //ucExt.wrapperHT.classList.add(ATTR_OF.getUc(ucExt.srcNode.uniqStamp));
        },
        controls: undefined,
        resizerObserver: undefined,
        finalizeInitAsync: async (param0) => {
            let ext = this.ucExtends;
            //ext.srcNode.pushCSS(ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss, ext.fileInfo.projectInfo.importMetaURL, ext.self);
            ext.srcNode.pushCSS(ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss, param0.source.cssContents, ext.self);
            if (ext.isDialogBox) {
                ext.Events.afterInitlize.on(param0.events.afterInitlize);
                await ext.Events.afterInitlize.fireAsync([this]);
            }
        },
        finalizeInit: (param0) => {
            let ext = this.ucExtends;
            //ext.srcNode.pushCSS(ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss, ext.fileInfo.projectInfo.importMetaURL, ext.self);
            ext.srcNode.pushCSS(ext.srcNode.cssFilePath ??
                ext.fileInfo.pathOf.scss, param0.source.cssContents, ext.self);
            if (ext.isDialogBox) {
                ext.Events.afterInitlize.on(param0.events.afterInitlize);
                ext.Events.afterInitlize.fire([this]);
            }
        },
        visibility: 'inherit',
        getVisibility: () => {
            let ext = this.ucExtends;
            return (ext.isForm || ext.visibility != 'inherit') ?
                ext.visibility : ext.PARENT.ucExtends.visibility;
        },
        show: ({ at = undefined, defaultFocusAt = undefined, decision = 'append' } = {}) => {
            let _extend = this.ucExtends;
            let _element = _extend.initalComponents.targetElement;
            _element = at ?? _element;
            if (_element) {
                switch (decision) {
                    case 'append':
                        _element.append(_extend.wrapperHT);
                        break;
                    default:
                        _element.after(_extend.wrapperHT);
                        _element.remove();
                        break;
                }
            }
            if (_extend.dialogForm == undefined)
                _extend.dialogForm = _extend.isForm ? this : _extend.PARENT.ucExtends.dialogForm;
            _extend.Events.loaded.fire();
            _extend.visibility = 'visible';
            if (defaultFocusAt)
                TabIndexManager.focusTo(defaultFocusAt);
            //return undefined as Usercontrol
        },
        dialogResolver: undefined,
        showDialog: async ({ defaultFocusAt = undefined, at = undefined, keepCurrentVisible = true,
        // afterClose = undefined
         } = {}) => {
            let _extends = this.ucExtends;
            let alreadyLoadedBefore = _extends.isDialogBox;
            _extends.isDialogBox = true;
            let _parentExt = _extends.PARENT.ucExtends;
            let _oldParentVisibleValue = _parentExt.keepVisible;
            _parentExt.keepVisible = keepCurrentVisible;
            const ele = at ?? _extends.initalComponents.targetElement ?? _extends.fileInfo.projectInfo.defaultLoadAt;
            if (ele != document.body && ele?.previousElementSibling != null) {
                const puc = Usercontrol.parse(ele.previousElementSibling);
                if (puc != undefined)
                    puc.ucExtends.lastFocuedElement = document.activeElement;
                //pera.parentUc.ucExtends.lastFocuedElement = document.activeElement as HTMLElement;
            }
            if (ele) {
                ele.append(_extends.wrapperHT);
                await WinManager.push(this);
            }
            _extends.Events.afterClose.on(() => {
                _extends.PARENT.ucExtends.keepVisible = _oldParentVisibleValue;
            });
            //if (afterClose)
            //    _extends.Events.afterClose.on(afterClose);
            if (_extends.dialogForm == undefined)
                _extends.dialogForm = this;
            //}, 1);
            //if (!alreadyLoadedBefore)
            _extends.Events.loaded.fireAsync();
            //requestAnimationFrame(() => {
            if (!defaultFocusAt) {
                TabIndexManager.moveNext(_extends.self, undefined);
            }
            else {
                TabIndexManager.focusTo(defaultFocusAt);
            }
            return new Promise(async (resolve) => {
                _extends.dialogResolver = resolve;
            });
        },
        /*queryElements(selector: string, callback: (element: HTMLElement) => void): void {
            let elements = document.querySelectorAll(selector);
            elements.forEach(element => callback(element as HTMLElement));
        },*/
        //idList: [],
        //stampRow: userControlStampRow,
        _windowstate: 'normal',
        get windowstate() { return this._windowstate; },
        set windowstate(state) { this._windowstate = state; this.Events.winStateChanged.fire([state]); },
        getChildsRefByMainPath: (_mainfile_Rootpath) => {
            let _ext = this.ucExtends;
            return _ext.dependant.filter(s => ucUtil.equalIgnoreCase(s.ucExtends.fileInfo.fullWithoutExt('html'), _mainfile_Rootpath));
        },
        getFirstChildRefByMainPath: (_mainfile_Rootpath) => {
            let _ext = this.ucExtends;
            return _ext.dependant.find(s => ucUtil.equalIgnoreCase(s.ucExtends.fileInfo.fullWithoutExt('html'), _mainfile_Rootpath));
        },
        /* options: {
             ucExt: () => this.ucExtends,
         },*/
        Events: {
            /** @private  */
            _contextChange: new CommonEvent(),
            get contextChange() { return this.dialogExt().Events._contextChange; },
            /** @private  */
            _afterInitlize: new CommonEvent(),
            get afterInitlize() { return this.dialogExt().Events._afterInitlize; },
            // @ts-ignore
            beforeClose: new CommonEvent(),
            afterClose: new CommonEvent(),
            /*
            // @ts-ignore
             beforeHide: new CommonEvent<({ prevent = false }) => void>(),
             afterHide: new CommonEvent<() => void>(),*/
            onDestruction: new CommonEvent(),
            captionChanged: new CommonEvent(),
            winStateChanged: new CommonEvent(),
            //activate: new CommonEvent<() => void>(),
            _activate: new CommonEvent(),
            get activate() { return this.dialogExt().Events._activate; },
            _deactivate: new CommonEvent(),
            get deactivate() { return this.dialogExt().Events._deactivate; },
            beforeFreez: new CommonEvent(),
            beforeUnFreez: new CommonEvent(),
            loaded: new CommonEvent(),
            loadLastSession: new CommonEvent(),
            /** @private  */
            _newSessionGenerate: new CommonEvent(),
            get newSessionGenerate() { return this.formExt().Events._newSessionGenerate; },
            /** @private  */
            _completeSessionLoad: new CommonEvent(),
            get completeSessionLoad() { return this.formExt().Events._completeSessionLoad; },
            sizeChanged: new CommonEvent(),
            formExt: () => this.ucExtends.form.ucExtends,
            dialogExt: () => this.ucExtends.dialogForm.ucExtends,
            onDataExport: (_data) => { return false; },
            onDataImport: (_data) => { return false; },
        },
        distructOnClose: true,
        close: async () => {
            let _ext = this.ucExtends;
            let res = { prevent: false };
            await _ext.Events.beforeClose.fireAsync([res]); // _ext.Events.beforeHide
            if (!res.prevent) {
                if (this.ucExtends.distructOnClose)
                    this.destruct();
                else
                    this.hide();
            }
            if (_ext.dialogResolver != undefined)
                _ext.dialogResolver(_ext.DialogResult);
        },
        passElement: (ele, options) => {
            return this.ucExtends.srcNode.passElement(ele, options);
        },
        designer: {
            setCaption: (text) => {
                this.ucExtends.wrapperHT.setAttribute("x-caption", text);
                this.ucExtends.Events.captionChanged.fire([text]);
            },
            getAllControls: ( /*specific?: string[]*/) => {
                let childs = {};
                let uExt = this.ucExtends;
                let fromElement = uExt.wrapperHT;
                let uniqStamp = uExt.srcNode.localStamp;
                /*if (specific != undefined) {
                    for (let i = 0, len = specific.length; i < len; i++) {
                        const itmpath = specific[i];
                        if (!(itmpath in childs)) {
                            let ele = fromElement.querySelector(`[${ATTR_OF.X_NAME}='${itmpath}'][${ATTR_OF.UC.ALL}^='${uniqStamp}_']`) as HTMLElement; // old one `[${propOpt.ATTR.ACCESS_KEY}='${itmpath}'][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                            //let ele = fromElement.querySelector(`[${propOpt.ATTR.ACCESS_KEY}='${itmpath}']${ATTR_OF.setParent(uniqStamp)}`) as HTMLElement;
                            fillObj(itmpath, ele);
                        }
                    }
                } else {*/
                let eleAr = [];
                if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
                    eleAr = Array.from(fromElement.querySelectorAll(`[${ATTR_OF.X_NAME}][${ATTR_OF.UC.ALL}^='${uniqStamp}_']`)); // old one `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                }
                else {
                    eleAr = Array.from(fromElement.querySelectorAll(`.${ATTR_OF.__CLASS(uniqStamp, 'l')}[${ATTR_OF.X_NAME}]`)); // old one `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                }
                for (let i = 0, len = eleAr.length; i < len; i++) {
                    const ele = eleAr[i];
                    SourceNode.ExtendControlObject(childs, ele.getAttribute(ATTR_OF.X_NAME), ele);
                }
                return childs;
            }
        },
    };
}
;
export const TransferDataNode = {
    type: "unknown",
    unqKey: '',
    data: undefined,
};
//# sourceMappingURL=Usercontrol.js.map