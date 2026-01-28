import { ExtractArguments, ISourceOptions, ITptOptions, IUcOptions, UCGenerateMode, UcStates, WhatToDoWithTargetElement, objectOpt } from "../common/enumAndMore.js";
import { GetUniqueId } from "../common/ipc/enumAndMore.js";
import { codeFileInfo } from "../global/codeFileInfo.js";
import { CommonEvent } from "../global/commonEvent.js";
import { ATTR_OF } from "../global/runtimeOpt.js";
import { TemplateMaker } from "../global/TemplateMaker.js";
import { ucUtil } from "../global/ucUtil.js";
import { FilterContent, IPassElementOptions, STYLER_SELECTOR_TYPE, SourceNode } from "../lib/StampGenerator.js";
import { TabIndexManager } from "../lib/TabIndexManager.js";
import { WinManager } from "../lib/WinManager.js";
import { nodeFn } from "./nodeFn.js";
import { ResourceManage } from "./ResourceManage.js";
import { CSSVariableScope, CssVariableHandler, StyleBaseType, VariableList } from "./StylerRegs.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export class Usercontrol {
    static readonly guid: string;
    static MATERIAL: ISourceOptions = {
        htmlContents: undefined as string,
        cssContents: undefined as string,
    }
    static parse(node: HTMLElement): Usercontrol { return node["#data"](ATTR_OF.BASE_OBJECT); }
    static Resolver = (outDesignerImportMetaUrl: string, relPathOfOutHtml: string) => {
        let fp = nodeFn.url.fileURLToPath(outDesignerImportMetaUrl); // `absFileUrl` designer js path
        return nodeFn.path.resolveFilePath(fp, relPathOfOutHtml);
    }
    static async GenerateControls(mainUc: Usercontrol, args?: IUcOptions, htmlCodePath?: string) {
        const mainFilePath = htmlCodePath;
        async function _tpt(xname: string, finfo: codeFileInfo, targetEle: HTMLElement) {
            //let jsPath = ucUtil.changeExtension(nodeExp.path.resolveFilePath(mainFilePath, xfrom), '.html', 'js');
            let jsPath: string;

            jsPath = finfo.pathOf.code;
            let className = nodeFn.path.basename(jsPath).split('.')[0];
            let frmType = await import(jsPath)[className] as Usercontrol;
            mainUc[xname] = await frmType['CreateAsync']({
                parentUc: mainUc,
                accessName: "xname",
                elementHT: targetEle,
            } as ITptOptions);
        }
        async function _uc(xname: string, finfo: codeFileInfo, targetEle: HTMLElement) {
            let jsPath: string;

            jsPath = finfo.pathOf.code; //ucUtil.changeExtension(nodeExp.path.resolveFilePath(mainFilePath, xfrom), '.html', '.js');
            let className = nodeFn.path.basename(jsPath).split('.')[0];
            let ft = await import(jsPath);
            let frmType = ft[className] as Usercontrol;
            if (frmType == undefined) debugger;
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
                targetElement: targetEle as any
            } as IUcOptions);
            const uc = mainUc[xname] as Usercontrol;
            uc.ucExtends.show({ decision: 'replace' });
        }

        const mainFinfo = args.cfInfo;
        const pref = args.cfInfo.projectInfo.config.preference;
        for (const [xname, htAr] of Object.entries(mainUc.ucExtends.controls)) {
            let ele = htAr as HTMLElement;
            if (ele.hasAttribute('x-from')) {
                let xfrom = ele.getAttribute(ATTR_OF.X_FROM);
                let targetPath = nodeFn.path.resolveFilePath(mainFinfo.pathOf.html, xfrom);
                let finfo = new codeFileInfo();
                finfo.parseUrl(targetPath, pref.outDir as any, mainFinfo.pathOf.html);
                if (xfrom.endsWith('.uc.html'))
                    await _uc(xname, finfo, ele);
                else
                    await _tpt(xname, finfo, ele);
            } else mainUc[xname] = htAr;
        }
        // console.log(importMeta);

        //console.log(uc.ucExtends.controls);

    }

    static HiddenSpace: HTMLElement = document.createElement('hspc' + GetUniqueId());

    static UcOptionsStc: IUcOptions;

    static extractArgs = (args: IArguments) => ExtractArguments(args);

    constructor() {
        //Usercontrol._CSS_VAR_STAMP++;
        //this.ucExtends.cssVarStampKey = 'u' + Usercontrol._CSS_VAR_STAMP;

    }
    private hide = async () => {
        let _ext = this.ucExtends;
        let res = { prevent: false };

        _ext.visibility = 'hidden';
        if (_ext.isDialogBox)
            await WinManager.pop(this);
        Usercontrol.HiddenSpace.appendChild(_ext.wrapperHT);
        await _ext.Events.afterClose.fireAsync([this]);  // _ext.Events.afterHide

    }
    private destruct = async (): Promise<boolean> => {
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
    }
    static templateMkr = new Map<string, string>();
    public ucExtends = {
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
        DialogResult: undefined as UcDialogResult,
        mode: 'client' as UCGenerateMode,
        ___META: {
            CONTEXT: undefined,
            PREV_CREATED_ID: undefined,
            PREV_UPDATED_ID: undefined,
            SELECTED_ID: undefined,
            CLOSE_ON_SAVE: undefined as boolean,
        },
        fileInfo: undefined as codeFileInfo,
        form: undefined as Usercontrol,
        dialogForm: undefined as Usercontrol,
        PARENT: undefined as Usercontrol,
        // session: undefined as SessionManager,// new SessionManager(),
        srcNode: undefined as SourceNode,

        wrapperHT: undefined as HTMLElement,
        isDialogBox: false as boolean,

        keepVisible: false as boolean,
        parentDependantIndex: -1 as number,
        dependant: [] as Usercontrol[],

        //HIDE_OR_CLOSE: 'close' as 'hide' | 'close',
        isForm: false,
        get formExtends() { return (this.form as Usercontrol).ucExtends; },
        get self(): HTMLElement { return this.wrapperHT; },
        set caption(text: string) {
            this.designer.setCaption(text);
        },
        get caption() {
            return this.wrapperHT.getAttribute('x-caption');
        },
        lastFocuedElement: undefined as HTMLElement,
        keepVisible_Till_I_Exist: (I: Usercontrol) => {
            let _this = this;
            let vopt = this.ucExtends.keepVisible;
            this.ucExtends.keepVisible = true;
            I.ucExtends.Events.afterClose.on(() => {
                _this.ucExtends.keepVisible = vopt;
            });
        },
        find: (skey: string): HTMLElement[] => {
            let ar = skey.split(',');
            let _this = this.ucExtends;
            let uniqStamp = _this.srcNode.localStamp;
            ar = ar.map((s) => {
                s = FilterContent.select_inline_filter(s, uniqStamp);
                return s;
            });
            let nodeList = _this.self.querySelectorAll(ar.join(","));
            return Array.from(nodeList) as HTMLElement[];
        },

        initalComponents: {
            targetElement: undefined as HTMLElement,
            elements: undefined as HTMLCollection,
            stageHT: undefined as HTMLElement,
            changeStage: (newStage: HTMLElement): boolean => {
                let ucExt = this.ucExtends;
                if (!this.ucExtends.wrapperHT.contains(newStage)) return false;
                let initCompo = ucExt.initalComponents;
                let arL = Array.from(initCompo?.elements ?? []);
                let ctrls: HTMLElement[] = [];
                for (let index = 0, len = arL.length; index < len; index++) {
                    const node = arL[index] as HTMLElement;
                    if (!node.contains(newStage)) {
                        newStage.appendChild(node);
                    }
                }
                initCompo.stageHT = newStage;
                return true;
            }
        },

        setCssVariable: (varList: VariableList, scope: CSSVariableScope) => {
            let styler = this.ucExtends.srcNode.styler;
            switch (scope) {
                case 'global': CssVariableHandler.SetCSSVarValue(varList, '' + styler.KEYS.LOCAL, "g"); break;
                //case 'template': CssVariableHandler.SETVALUE(varList, styler.TEMPLATE_STAMP_KEY, "t", this.ucExtends.self); break;
                case 'local': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.LOCAL, "l", this.ucExtends.self); break;
                case 'internal': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.INTERNAL, "i", this.ucExtends.self); break; // StylerRegs.internalKey
            }
        },
        getCssVariable: (key: string, scope: CSSVariableScope): string => {
            let styler = this.ucExtends.srcNode.styler;
            switch (scope) {
                case 'global': return document.body.style.getPropertyValue(
                    CssVariableHandler.GetCombinedCSSVarName(key, '' + styler.KEYS.ROOT, "g"));
                /*case 'template': return this.ucExtends.self.style.getPropertyValue(
                    CssVariableHandler.getKeyName(key, styler.TEMPLATE_STAMP_KEY, "t"));*/
                case 'local': return this.ucExtends.self.style.getPropertyValue(
                    CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.LOCAL, "l"));
                case 'internal': return this.ucExtends.self.style.getPropertyValue(
                    CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.INTERNAL, "i"));  // StylerRegs.internalKey
                default: return '';
            }
        },
        cssVarStampKey: '0',
        initializecomponent: (param0: IUcOptions): void => {
            let ucExt = this.ucExtends;
            ucExt.mode = param0.mode;
            if (param0.events.beforeInitlize != undefined) param0.events.beforeInitlize(this);
            ucExt.isForm = (param0.parentUc == undefined);
            ucExt.fileInfo = param0.cfInfo;
            //console.log(param0.source.htmlGuid);

            //console.log(Resources.get(param0.source.htmlGuid));

            if (ucExt.isForm) {
                ucExt.dialogForm = this;
                ucExt.show = () => { throw new Error('Parent Free Usercontrol SHOULD be CALL by `showDialog` \n ' + param0.cfInfo.pathOf.html) };
            } else {
                ucExt.dialogForm = param0.parentUc.ucExtends.dialogForm;
                ucExt.showDialog = () => { throw new Error('with Parent Usercontrol SHOULD be CALL by `show` \n ' + param0.cfInfo.pathOf.html) };
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
            let htContent = ResourceManage.getContent(param0.source.htmlGuid); //param0.source.htmlContents;


            let tmkr = Usercontrol.templateMkr.get(htPathToRead);
            if (tmkr == undefined) {
                let t = new TemplateMaker(htPathToRead);
                tmkr = t.compileTemplate(htContent)(param0.source.htmlRow ?? {});
                Usercontrol.templateMkr.set(htPathToRead, tmkr);
            }
            let isAlreadyExist = ucExt.srcNode.htmlCode.load(
                tmkr
            );
            if (!isAlreadyExist)
                ucExt.srcNode.loadHTML();
            ucExt.wrapperHT = ucExt.srcNode.dataHT.cloneNode(true) as HTMLElement;

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
            } else {
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
                } else {
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
                } else {
                    if (sizeChangeEvt.length == 0) {
                        ucExt.resizerObserver.disconnect();
                        ucExt.resizerObserver = undefined;
                    }
                }
            }
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
            ucExt.Events.onDataExport = (data) =>
                pucExt.Events.onDataExport(data);
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
        controls: undefined as { [xname: string]: HTMLElement | HTMLElement[] },
        resizerObserver: undefined as ResizeObserver,
        finalizeInitAsync: async (param0: IUcOptions) => {
            let ext = this.ucExtends;
            //ext.srcNode.pushCSS(ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss, ext.fileInfo.projectInfo.importMetaURL, ext.self);
            const cssContent = ResourceManage.getContent(param0.source.cssGuid);
            ext.srcNode.pushCSS(
                ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss,
                cssContent,//param0.source.cssContents,
                ext.self);
            //console.log(cssContent);

            if (ext.isDialogBox) {
                ext.Events.afterInitlize.on(param0.events.afterInitlize);
                await ext.Events.afterInitlize.fireAsync([this]);
            }
        },
        finalizeInit: (param0: IUcOptions) => {
            let ext = this.ucExtends;
            //ext.srcNode.pushCSS(ext.srcNode.cssFilePath ?? ext.fileInfo.pathOf.scss, ext.fileInfo.projectInfo.importMetaURL, ext.self);
            const cssContent = ResourceManage.getContent(param0.source.cssGuid);
            ext.srcNode.pushCSS(
                ext.srcNode.cssFilePath ??
                ext.fileInfo.pathOf.scss,
                cssContent,//param0.source.cssContents,
                ext.self);

            
            if (ext.isDialogBox) {
                ext.Events.afterInitlize.on(param0.events.afterInitlize);
                ext.Events.afterInitlize.fire([this]);
            }
        },

        visibility: 'inherit' as ucVisibility,
        getVisibility: (): ucVisibility => {
            let ext = this.ucExtends;
            return (ext.isForm || ext.visibility != 'inherit') ?
                ext.visibility : ext.PARENT.ucExtends.visibility;
        },
        show: ({ at = undefined, defaultFocusAt = undefined, decision = 'append' }:
            { at?: HTMLElement, defaultFocusAt?: HTMLElement, decision?: WhatToDoWithTargetElement, visibility?: ucVisibility } = {}) => {
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

        dialogResolver: undefined as (value: UcDialogResult) => void,
        showDialog: async ({ defaultFocusAt = undefined, at = undefined, keepCurrentVisible = true,
            // afterClose = undefined
        }: {
            at?: HTMLElement,
            keepCurrentVisible?: boolean,
            defaultFocusAt?: HTMLElement,
            //afterClose?: (frm: Usercontrol) => void,
        } = {}) => {
            let _extends = this.ucExtends;
            let alreadyLoadedBefore = _extends.isDialogBox;
            _extends.isDialogBox = true;
            let _parentExt = _extends.PARENT.ucExtends;
            let _oldParentVisibleValue = _parentExt.keepVisible;
            _parentExt.keepVisible = keepCurrentVisible;
            const ele = at ?? _extends.initalComponents.targetElement ?? _extends.fileInfo.projectInfo.defaultLoadAt;


            if (ele != document.body && ele?.previousElementSibling != null) {
                const puc = Usercontrol.parse(ele.previousElementSibling as HTMLElement);
                if (puc != undefined)
                    puc.ucExtends.lastFocuedElement = document.activeElement as HTMLElement;
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
            } else {
                TabIndexManager.focusTo(defaultFocusAt);
            }
            return new Promise(async (resolve: (v: UcDialogResult) => void) => {
                _extends.dialogResolver = resolve;
            });
        },

        /*queryElements(selector: string, callback: (element: HTMLElement) => void): void {
            let elements = document.querySelectorAll(selector);
            elements.forEach(element => callback(element as HTMLElement));
        },*/
        //idList: [],
        //stampRow: userControlStampRow,
        _windowstate: 'normal' as UcStates,
        get windowstate() { return this._windowstate; },
        set windowstate(state: UcStates) { this._windowstate = state; this.Events.winStateChanged.fire([state]); },
        getChildsRefByMainPath: (_mainfile_Rootpath: string): Usercontrol[] => {
            let _ext = this.ucExtends;
            return _ext.dependant.filter(s => ucUtil.equalIgnoreCase(s.ucExtends.fileInfo.fullWithoutExt('html'), _mainfile_Rootpath));
        },
        getFirstChildRefByMainPath: (_mainfile_Rootpath: string): Usercontrol => {
            let _ext = this.ucExtends;
            return _ext.dependant.find(s => ucUtil.equalIgnoreCase(s.ucExtends.fileInfo.fullWithoutExt('html'), _mainfile_Rootpath));
        },
        /* options: {
             ucExt: () => this.ucExtends,
         },*/
        Events: {

            /** @private  */
            _contextChange: new CommonEvent<() => void>(),
            get contextChange() { return this.dialogExt().Events._contextChange; },
            /** @private  */
            _afterInitlize: new CommonEvent<(uc: Usercontrol) => void>(),
            get afterInitlize() { return this.dialogExt().Events._afterInitlize; },
            // @ts-ignore
            beforeClose: new CommonEvent<(args: { prevent?: boolean }) => void>(),
            afterClose: new CommonEvent<(uc?: Usercontrol) => void>(),

            /*
            // @ts-ignore
             beforeHide: new CommonEvent<({ prevent = false }) => void>(),
             afterHide: new CommonEvent<() => void>(),*/
            onDestruction: new CommonEvent<({ }) => void>(),

            captionChanged: new CommonEvent<(newCaptionText: string) => void>(),
            winStateChanged: new CommonEvent<(state: UcStates) => void>(),
            //activate: new CommonEvent<() => void>(),
            _activate: new CommonEvent<() => void>(),
            get activate() { return this.dialogExt().Events._activate; },
            _deactivate: new CommonEvent<() => void>(),
            get deactivate() { return this.dialogExt().Events._deactivate; },

            beforeFreez: new CommonEvent<(newUc: Usercontrol) => void>(),
            beforeUnFreez: new CommonEvent<(oldUc: Usercontrol) => void>(),
            loaded: new CommonEvent<() => void>(),
            loadLastSession: new CommonEvent<() => void>(),
            /** @private  */
            _newSessionGenerate: new CommonEvent<() => void>(),
            get newSessionGenerate() { return this.formExt().Events._newSessionGenerate; },
            /** @private  */
            _completeSessionLoad: new CommonEvent<() => void>(),
            get completeSessionLoad() { return this.formExt().Events._completeSessionLoad; },
            sizeChanged: new CommonEvent<(size: ResizeObserverEntry[]) => void>(),
            formExt: () => this.ucExtends.form.ucExtends,
            dialogExt: () => this.ucExtends.dialogForm.ucExtends,
            onDataExport: (_data: ITransferDataNode) => { return false; },
            onDataImport: (_data: ITransferDataNode) => { return false; },
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
            if (_ext.dialogResolver != undefined) _ext.dialogResolver(_ext.DialogResult);
        },

        passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions): { [xname: string]: HTMLElement | HTMLElement[] } => {
            return this.ucExtends.srcNode.passElement(ele, options);
        },

        designer: {
            setCaption: (text: string) => {
                this.ucExtends.wrapperHT.setAttribute("x-caption", text);
                this.ucExtends.Events.captionChanged.fire([text]);
            },
            getAllControls: (/*specific?: string[]*/): { [key: string]: HTMLElement | HTMLElement[] } => {
                let childs: { [key: string]: HTMLElement | HTMLElement[] } = {};
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
                let eleAr: HTMLElement[] = [];
                if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
                    eleAr = Array.from(fromElement.querySelectorAll(`[${ATTR_OF.X_NAME}][${ATTR_OF.UC.ALL}^='${uniqStamp}_']`)) as HTMLElement[];  // old one `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                } else {
                    eleAr = Array.from(fromElement.querySelectorAll(`.${ATTR_OF.__CLASS(uniqStamp, 'l')}[${ATTR_OF.X_NAME}]`)) as HTMLElement[];  // old one `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
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
export interface ITransferDataNode {
    type: "unknown" | "uc" | "uc-link" | "tpt" | "tpt-link" | "text" | "json" | "link";
    unqKey?: string;
    data?: any;
}
;
export const TransferDataNode: ITransferDataNode = {
    type: "unknown",
    unqKey: '',
    data: undefined,
};

