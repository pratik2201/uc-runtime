import { TemplateMaker } from "ap-shared-core/out/template/TemplateMaker.js";
import { IUsercontrolContent } from "ap-shared-core/out/uc-runtime/Template.js";
import { ATTR_OF } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { objectOpt } from "../../common/enumAndMore.js";
import { FilterContent, STYLER_SELECTOR_TYPE, SourceNode } from "../../lib/StampGenerator.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { AssemblyManager } from "../Assembly.js";
import { CssVariableHandler, StyleBaseType } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { Usercontrol$Event } from "./Usercontrol$Event.js";
;
export const TransferDataNode = {
    type: "unknown",
    unqKey: '',
    data: undefined,
};
export class UserControl$Extended {
    constructor() {
    }
    main;
    init(main) {
        this.main = main;
        this.Events = new Usercontrol$Event(main);
    }
    get Context() { return this.dialogForm?.ucExtends.___META.CONTEXT; }
    set SetContext(context) {
        let df = this.dialogForm.ucExtends;
        df.___META.CONTEXT = context;
        df.Events.contextChange.fire([]);
    }
    DialogResult = undefined;
    mode = 'client';
    ___META = {
        CONTEXT: undefined,
        PREV_CREATED_ID: undefined,
        PREV_UPDATED_ID: undefined,
        SELECTED_ID: undefined,
        CLOSE_ON_SAVE: undefined,
    };
    form;
    dialogForm;
    PARENT;
    resource;
    srcNode;
    assembly;
    wrapperHT;
    isDialogBox = false;
    guid;
    keepVisible = false;
    parentDependantIndex = -1;
    dependant = [];
    isForm = false;
    get formExtends() { return this.form.ucExtends; }
    get self() { return this.wrapperHT; }
    lastFocuedElement;
    keepVisible_Till_I_Exist = (I) => {
        let _this = this;
        let vopt = this.keepVisible;
        this.keepVisible = true;
        I.ucExtends.Events.afterClose.on(() => {
            _this.keepVisible = vopt;
        });
    };
    find = (skey) => {
        let ar = skey.split(',');
        let _this = this;
        let uniqStamp = _this.srcNode.localStamp;
        ar = ar.map((s) => {
            s = FilterContent.select_inline_filter(s, uniqStamp);
            return s;
        });
        let nodeList = _this.self.querySelectorAll(ar.join(","));
        return Array.from(nodeList);
    };
    initalComponents = {
        targetElement: undefined,
        elements: undefined,
        stageHT: undefined,
        changeStage: (newStage) => {
            if (!this.wrapperHT.contains(newStage))
                return false;
            let initCompo = this.initalComponents;
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
    };
    setCssVariable = (varList, scope) => {
        let styler = this.srcNode.styler;
        switch (scope) {
            case 'global':
                CssVariableHandler.SetCSSVarValue(varList, '' + styler.KEYS.LOCAL, "g");
                break;
            case 'local':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.LOCAL, "l", this.self);
                break;
            case 'internal':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.INTERNAL, "i", this.self);
                break; // StylerRegs.internalKey
        }
    };
    getCssVariable = (key, scope) => {
        let styler = this.srcNode.styler;
        switch (scope) {
            case 'global': return document.body.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, '' + styler.KEYS.ROOT, "g"));
            case 'local': return this.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.LOCAL, "l"));
            case 'internal': return this.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.INTERNAL, "i")); // StylerRegs.internalKey
            default: return '';
        }
    };
    cssVarStampKey = '0';
    initializecomponent = (param0) => {
        let ucExt = this;
        ucExt.mode = param0.mode;
        // if (param0.guid != undefined) {
        //     ucExt.guid = param0.guid;
        //     const cfg = ResourceManage.getContent(this.guid);
        //     const cfgObj: ICoupleNode = normalizeJSON(cfg);
        //     //const content = ResourceManage.getContent(param0.guid as never) as ;
        //     ucExt.resource = new IUsercontrolContent();
        //     ucExt.resource.htmlContents = ResourceManage.getContent(cfgObj.htmlGuid as any);
        //     ucExt.resource.cssContents = ResourceManage.getContent(cfgObj.cssGuid as any);
        //     /*const jsn = normalizeJSON(content);
        //     Object.assign(ucExt.resource, jsn);*/
        // }
        let htmlContent = undefined;
        let cssContent = undefined;
        let cfgObj = {};
        /*if (pera.guid != undefined) {
            this.guid = pera.guid;
            this.assembly = AssemblyManager.Parse(this.guid);
            const cfg = ResourceManage.getContent(this.guid);
            cfgObj = normalizeJSON(cfg);
            htmlContent = ResourceManage.getContent(cfgObj.htmlGuid as any);
            cssContent = ResourceManage.getContent(cfgObj.cssGuid as any);
        } else {*/
        this.guid = param0.guid;
        this.assembly = AssemblyManager.Parse(this.guid);
        htmlContent = param0.htmlContent;
        cssContent = param0.cssContent;
        ucExt.resource = new IUsercontrolContent();
        ucExt.resource.htmlContents = param0.htmlContent; //ResourceManage.getContent(cfgObj.htmlGuid as any);
        ucExt.resource.cssContents = param0.cssContent; // ResourceManage.getContent(cfgObj.cssGuid as any);
        ucExt.resource.htmlRow = {};
        if (param0.events.beforeInitlize != undefined)
            param0.events.beforeInitlize(this.main);
        ucExt.isForm = (param0.parentUc == undefined);
        if (ucExt.isForm) {
            ucExt.dialogForm = this.main;
            ucExt.show = () => { throw new Error('Parent Free Usercontrol SHOULD be CALL by `showDialog` \n ' + ucExt.guid); };
        }
        else {
            ucExt.dialogForm = param0.parentUc.ucExtends.dialogForm;
            ucExt.showDialog = () => { throw new Error('with Parent Usercontrol SHOULD be CALL by `show` \n ' + ucExt.guid); };
        }
        if (ucExt.isForm) {
            ucExt.dialogForm.ucExtends.___META.CONTEXT = param0.context;
        }
        ucExt.assembly = AssemblyManager.Parse(ucExt.guid);
        ucExt.guid = param0.guid;
        ucExt.srcNode = SourceNode.registerSource({
            key: ucExt.guid,
            cssKeyStamp: param0.cssKeyStamp,
            accessName: param0.accessName,
            assembly: ucExt.assembly,
            //project: ucExt.fileInfo.projectInfo,
            baseType: StyleBaseType.UserControl,
            mode: '^',
        });
        //let htPathToRead = param0.source.htmlFilePath ?? ucExt.fileInfo.pathOf.html;
        //ucExt.resource = param0.source;
        let tmkr = Usercontrol.templateMkr.get(ucExt.guid);
        if (tmkr == undefined) {
            let t = new TemplateMaker( /*ucExt.htmlGuid*/);
            tmkr = t.compileTemplate(ucExt.resource.htmlContents)(param0.source.htmlRow ?? {});
            Usercontrol.templateMkr.set(ucExt.guid, tmkr);
        }
        let isAlreadyExist = ucExt.srcNode.htmlCode.load(tmkr);
        if (!isAlreadyExist)
            ucExt.srcNode.loadHTML();
        ucExt.wrapperHT = ucExt.srcNode.dataHT.cloneNode(true);
        if (ucExt.isForm) {
            ucExt.PARENT = this.main;
            ucExt.form = this.main;
            ucExt.srcNode.config({
                parentUc: ucExt.PARENT,
                parentSrc: ucExt.assembly.srcNode, //ucExt.fileInfo.projectInfo.stampSRC,
                wrapper: ucExt.wrapperHT,
                key: ucExt.guid,
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
                key: ucExt.guid,
                accessName: param0.accessName
            });
            if (param0.targetElement) {
                ucExt.initalComponents.elements = param0.targetElement.children;
                objectOpt.copyAttr(param0.targetElement, ucExt.wrapperHT);
                Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
            }
            else
                Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
        }
        ucExt.initalComponents.targetElement = param0.targetElement;
        let pucExt = ucExt.PARENT.ucExtends;
        ucExt.wrapperHT["#data"](ATTR_OF.BASE_OBJECT, this.main);
        if (!ucExt.isForm) {
            ucExt.parentDependantIndex = pucExt.dependant.length;
            pucExt.dependant.push(this.main);
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
        ucExt.Events.onDestruction.on(() => {
            for (let i = ucExt.dependant.length - 1; i >= 0; i--) {
                ucExt.dependant[i]?.ucExtends.destruct();
            }
            pucExt.dependant[ucExt.parentDependantIndex] = undefined;
        });
        ucExt.Events.onDataExport = (data) => pucExt.Events.onDataExport(data);
        if (ucExt.dialogForm == undefined && pucExt.dialogForm != undefined)
            ucExt.dialogForm = pucExt.dialogForm;
        ucExt.initalComponents.stageHT = ucExt.wrapperHT;
        ucExt.srcNode.setWrapper(ucExt.wrapperHT);
    };
    controls;
    resizerObserver;
    finalizeInit = (param0) => {
        let ext = this;
        const cssContent = ext.resource.cssContents;
        ext.srcNode.pushCSS(ext.guid, cssContent, ext.self);
        if (ext.isDialogBox) {
            ext.Events.afterInitlize.on(param0.events.afterInitlize);
            ext.Events.afterInitlize.fire([this.main]);
        }
    };
    takeoff = () => {
        delete this.initializecomponent;
        delete this.finalizeInit;
        //delete this.ucExtends.finalizeInitAsync;
    };
    visibility = 'inherit';
    getVisibility = () => {
        let ext = this;
        return (ext.isForm || ext.visibility != 'inherit') ?
            ext.visibility : ext.PARENT.ucExtends.visibility;
    };
    show = ({ at = undefined, defaultFocusAt = undefined, decision = 'append' } = {}) => {
        let _extend = this;
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
            _extend.dialogForm = _extend.isForm ? this.main : _extend.PARENT.ucExtends.dialogForm;
        _extend.Events.loaded.fire();
        _extend.visibility = 'visible';
        if (defaultFocusAt)
            TabIndexManager.focusTo(defaultFocusAt);
    };
    dialogResolver;
    showDialog = async ({ defaultFocusAt = undefined, at = undefined, keepCurrentVisible = true } = {}) => {
        let _extends = this;
        let alreadyLoadedBefore = _extends.isDialogBox;
        _extends.isDialogBox = true;
        let _parentExt = _extends.PARENT.ucExtends;
        let _oldParentVisibleValue = _parentExt.keepVisible;
        _parentExt.keepVisible = keepCurrentVisible;
        const ele = at ?? _extends.initalComponents.targetElement ?? _extends.assembly.defaultLoadAt;
        if (ele != document.body && ele?.previousElementSibling != null) {
            const puc = Usercontrol.parse(ele.previousElementSibling);
            if (puc != undefined)
                puc.ucExtends.lastFocuedElement = document.activeElement;
        }
        if (ele) {
            ele.append(_extends.wrapperHT);
            await WinManager.push(this.main);
        }
        _extends.Events.afterClose.on(() => {
            _extends.PARENT.ucExtends.keepVisible = _oldParentVisibleValue;
        });
        if (_extends.dialogForm == undefined)
            _extends.dialogForm = this.main;
        _extends.Events.loaded.fireAsync();
        if (!defaultFocusAt) {
            TabIndexManager.moveNext(_extends.self, undefined);
        }
        else {
            TabIndexManager.focusTo(defaultFocusAt);
        }
        return new Promise(async (resolve) => {
            _extends.dialogResolver = resolve;
        });
    };
    _windowstate = 'normal';
    get windowstate() { return this._windowstate; }
    ;
    set windowstate(state) { this._windowstate = state; this.Events.winStateChanged.fire([state]); }
    ;
    getChildsRefByMainPath = (guid) => {
        let _ext = this;
        return _ext.dependant.filter(s => s.ucExtends.guid == guid);
    };
    getFirstChildRefByMainPath = (guid) => {
        let _ext = this;
        return _ext.dependant.find(s => s.ucExtends.guid == guid);
    };
    Events;
    distructOnClose = true;
    close = async () => {
        let _ext = this;
        let res = { prevent: false };
        await _ext.Events.beforeClose.fireAsync([res]); // _ext.Events.beforeHide
        if (!res.prevent) {
            if (_ext.distructOnClose)
                this.destruct();
            else
                this.hide();
        }
        if (_ext.dialogResolver != undefined)
            _ext.dialogResolver(_ext.DialogResult);
    };
    passElement = (ele, options) => {
        return this.srcNode.passElement(ele, options);
    };
    set caption(text) {
        this.designer.setCaption(text);
    }
    get caption() {
        return this.wrapperHT.getAttribute('x-caption');
    }
    designer = {
        setCaption: (text) => {
            this.wrapperHT.setAttribute("x-caption", text);
            this.Events.captionChanged.fire([text]);
        },
        getAllControls: () => {
            let childs = {};
            let uExt = this;
            let fromElement = uExt.wrapperHT;
            let uniqStamp = uExt.srcNode.localStamp;
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
    };
    hide = async () => {
        let _ext = this;
        let res = { prevent: false };
        _ext.visibility = 'hidden';
        if (_ext.isDialogBox)
            await WinManager.pop(this.main);
        Usercontrol.HiddenSpace.appendChild(_ext.wrapperHT);
        await _ext.Events.afterClose.fireAsync([this.main]);
    };
    destruct = async () => {
        let main = this.main;
        await this.Events.onDestruction.fireAsync();
        if (this.isDialogBox)
            await WinManager.pop(main);
        this.Events.afterClose.fireAsync([main]);
        await Usercontrol.HiddenSpace.appendChild(this.wrapperHT);
        await this.srcNode.release();
        requestAnimationFrame(async () => {
            this.wrapperHT.remove();
            for (const key in main) {
                main[key] = undefined;
            }
        });
        return false;
    };
}
// Events = {
//     /** @private  */
//     _contextChange: new CommonEvent<() => void>(),
//     get contextChange() { return this.dialogExt().Events._contextChange; },
//     /** @private  */
//     _afterInitlize: new CommonEvent<(uc: Usercontrol) => void>(),
//     get afterInitlize() { return this.dialogExt().Events._afterInitlize; },
//     // @ts-ignore
//     beforeClose: new CommonEvent<(args: { prevent?: boolean }) => void>(),
//     afterClose: new CommonEvent<(uc?: Usercontrol) => void>(),
//     /*
//     // @ts-ignore
//      beforeHide: new CommonEvent<({ prevent = false }) => void>(),
//      afterHide: new CommonEvent<() => void>(),*/
//     onDestruction: new CommonEvent<({ }) => void>(),
//     captionChanged: new CommonEvent<(newCaptionText: string) => void>(),
//     winStateChanged: new CommonEvent<(state: UcStates) => void>(),
//     //activate: new CommonEvent<() => void>(),
//     _activate: new CommonEvent<() => void>(),
//     get activate() { return this.dialogExt().Events._activate; },
//     _deactivate: new CommonEvent<() => void>(),
//     get deactivate() { return this.dialogExt().Events._deactivate; },
//     beforeFreez: new CommonEvent<(newUc: Usercontrol) => void>(),
//     beforeUnFreez: new CommonEvent<(oldUc: Usercontrol) => void>(),
//     loaded: new CommonEvent<() => void>(),
//     loadLastSession: new CommonEvent<() => void>(),
//     /** @private  */
//     _newSessionGenerate: new CommonEvent<() => void>(),
//     get newSessionGenerate() { return this.formExt().Events._newSessionGenerate; },
//     /** @private  */
//     _completeSessionLoad: new CommonEvent<() => void>(),
//     get completeSessionLoad() { return this.formExt().Events._completeSessionLoad; },
//     sizeChanged: new CommonEvent<(size: ResizeObserverEntry[]) => void>(),
//     formExt: () => this.form.ucExtends,
//     dialogExt: () => this.dialogForm.ucExtends,
//     onDataExport: (_data: ITransferDataNode) => { return false; },
//     onDataImport: (_data: ITransferDataNode) => { return false; },
// }
//# sourceMappingURL=UserControl$Extended.js.map