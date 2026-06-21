import { ATTR_OF, ResourceKeyList, TemplateMaker } from "ap-shared-core/core-common.js";
import { IUsercontrolContent } from "ap-shared-core/core.js";
import { IUcOptions, UCGenerateMode, UcStates, WhatToDoWithTargetElement, objectOpt } from "../../common/enumAndMore.js";
import { FilterContent, IPassElementOptions, STYLER_SELECTOR_TYPE, SourceNode } from "../../lib/StampGenerator.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { Assembly, AssemblyManager } from "../Assembly.js";
import { CSSVariableScope, CssVariableHandler, IKeyStampNode, StyleBaseType, VariableList } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { Usercontrol$Event } from "./Usercontrol$Event.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
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

export class UserControl$Extended {
    constructor() {

    }
    //shortCutContext: ShortcutContext;
    private main: Usercontrol;
    init(main: Usercontrol) {
        this.main = main;
        this.Events = new Usercontrol$Event(main);
    }
    /*get Context() { return this.dialogForm?.ucExtends.___META.CONTEXT; }
    set SetContext(context) {
        let df = this.dialogForm.ucExtends;
        df.___META.CONTEXT = context;
        df.Events.contextChange.fire([]);

    }*/
    DialogResult = undefined as UcDialogResult;
    mode = 'client' as UCGenerateMode;
    /*___META = {
        CONTEXT: undefined,
        PREV_CREATED_ID: undefined,
        PREV_UPDATED_ID: undefined,
        SELECTED_ID: undefined,
        CLOSE_ON_SAVE: undefined as boolean,
    };*/
    form: Usercontrol;
    dialogForm: Usercontrol;
    PARENT: Usercontrol;
    resource: IUsercontrolContent;
    srcNode: SourceNode;
    assembly: Assembly;
    wrapperHT: HTMLElement;
    isDialogBox = false;
    guid: ResourceKeyList;
    keepVisible = false;
    parentDependantIndex = -1;
    dependant: Usercontrol[] = [];
    isForm = false;
    get formExtends() { return this.form.ucExtends; }
    get self() { return this.wrapperHT; }
    Keys: IKeyStampNode;
    lastFocuedElement: HTMLElement;
    keepVisible_Till_I_Exist = (I: Usercontrol) => {
        let _this = this;
        let vopt = this.keepVisible;
        this.keepVisible = true;
        I.ucExtends.Events.afterClose.on(() => {
            _this.keepVisible = vopt;
        });
    }
    find = (skey: string) => {
        let ar = skey.split(',');
        let _this = this;
        let uniqStamp = _this.srcNode.localStamp;
        ar = ar.map((s) => {
            s = FilterContent.select_inline_filter(s, uniqStamp);
            return s;
        });
        let nodeList = _this.self.querySelectorAll(ar.join(","));
        return Array.from(nodeList) as HTMLElement[];
    };

    initalComponents = {
        targetElement: undefined as HTMLElement,
        elements: undefined as HTMLCollection,
        stageHT: undefined as HTMLElement,
        changeStage: (newStage: HTMLElement): boolean => {
            if (!this.wrapperHT.contains(newStage)) return false;
            let initCompo = this.initalComponents;
            let arL = Array.from(initCompo?.elements ?? []);
            for (let index = 0, len = arL.length; index < len; index++) {
                const node = arL[index] as HTMLElement;
                if (!node.contains(newStage)) {
                    newStage.appendChild(node);
                }
            }
            initCompo.stageHT = newStage;
            return true;
        }
    };

    setCssVariable = (varList: VariableList, scope: CSSVariableScope) => {
        switch (scope) {
            case 'global': CssVariableHandler.SetCSSVarValue(varList, '' + this.Keys.LOCAL, "g"); break;
            case 'local': CssVariableHandler.SetCSSVarValue(varList, this.Keys.LOCAL, "l", this.self); break;
            case 'internal': CssVariableHandler.SetCSSVarValue(varList, this.Keys.INTERNAL, "i", this.self); break; // StylerRegs.internalKey
        }
    };
    getCssVariable = (key: string, scope: CSSVariableScope): string => {
        switch (scope) {
            case 'global': return document.body.style.getPropertyValue(
                CssVariableHandler.GetCombinedCSSVarName(key, '' + this.Keys.ROOT, "g"));
            case 'local': return this.self.style.getPropertyValue(
                CssVariableHandler.GetCombinedCSSVarName(key, this.Keys.LOCAL, "l"));
            case 'internal': return this.self.style.getPropertyValue(
                CssVariableHandler.GetCombinedCSSVarName(key, this.Keys.INTERNAL, "i"));  // StylerRegs.internalKey
            default: return '';
        }
    };
    cssVarStampKey = '0';
    private static templatemaker = new TemplateMaker();
    initializecomponent = async (param0: IUcOptions) => {
        let ucExt = this;
        ucExt.mode = param0.mode;
        this.guid = param0.guid;
        this.assembly = AssemblyManager.Parse(this.guid);
        ucExt.resource = new IUsercontrolContent();
        ucExt.resource.htmlContents = param0.htmlContent;
        ucExt.resource.cssContents = param0.cssContent;
        ucExt.resource.htmlRow = {};

        if (param0.events.beforeInitlize != undefined) param0.events.beforeInitlize(this.main);
        ucExt.isForm = (param0.parentUc == undefined);
        if (ucExt.isForm) {
            ucExt.dialogForm = this.main;
            //ucExt.shortCutContext = new ShortcutContext(ShortcutContext.globalRef);
            ucExt.show = () => { throw new Error('Parent Free Usercontrol SHOULD be CALL by `showDialog` \n ' + ucExt.guid) };
        } else {
            ucExt.dialogForm = param0.parentUc.ucExtends.dialogForm;
            //ucExt.shortCutContext = ucExt.dialogForm.ucExtends.shortCutContext;
            ucExt.showDialog = () => { throw new Error('with Parent Usercontrol SHOULD be CALL by `show` \n ' + ucExt.guid) };
        }
        /*if (ucExt.isForm) {
            ucExt.dialogForm.ucExtends.___META.CONTEXT = param0.context;
        }*/
        ucExt.assembly = AssemblyManager.Parse(ucExt.guid);

        ucExt.guid = param0.guid as never;
        let htmlCache = Usercontrol.templateMkr.get(ucExt.guid);
        if (htmlCache == undefined) {
            htmlCache = UserControl$Extended.templatemaker.compileTemplate(ucExt.resource.htmlContents)(param0.source.htmlRow ?? {});
            Usercontrol.templateMkr.set(ucExt.guid, htmlCache);
        }

        ucExt.srcNode = SourceNode.registerSource({
            objectKey: ucExt.guid,
            assembly: ucExt.assembly,
            cssKeyStamp: param0.cssKeyStamp,
            baseType: StyleBaseType.UserControl,
            mode: '^',
        });
        ucExt.Keys = ucExt.srcNode.styler.KEYS;
        let parentSrc = ucExt.assembly.srcNode;


        ucExt.srcNode.loadHTML(htmlCache);
        ucExt.wrapperHT = ucExt.srcNode.dataHT.cloneNode(true) as HTMLElement;
        if (ucExt.isForm) {
            ucExt.PARENT = this.main;
            ucExt.form = this.main;
        } else {
            ucExt.form = param0.parentUc.ucExtends.form;
            ucExt.PARENT = param0.parentUc;
            parentSrc = ucExt.PARENT.ucExtends.srcNode;
            if (param0.targetElement) {
                ucExt.initalComponents.elements = param0.targetElement.children;
                objectOpt.copyAttr(param0.targetElement, ucExt.wrapperHT);
                Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
            } else Usercontrol.HiddenSpace.append(ucExt.wrapperHT);
        }
        ucExt.srcNode.addChildAccessInParentNode({
            parentSrc: parentSrc,
            wrapper: ucExt.wrapperHT,
            key: ucExt.guid,
            accessName: param0.accessName
        });
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
            } else {
                if (sizeChangeEvt.length == 0) {
                    ucExt.resizerObserver.disconnect();
                    ucExt.resizerObserver = undefined;
                }
            }
        }
        ucExt.Events.onDestruction.on(async () => {
            for (let i = ucExt.dependant.length - 1; i >= 0; i--) {
                await ucExt.dependant[i]?.ucExtends.destruct();
            }
            pucExt.dependant[ucExt.parentDependantIndex] = undefined;
        });
        ucExt.Events.onDataExport = (data) =>
            pucExt.Events.onDataExport(data);
        if (ucExt.dialogForm == undefined && pucExt.dialogForm != undefined)
            ucExt.dialogForm = pucExt.dialogForm;
        ucExt.initalComponents.stageHT = ucExt.wrapperHT;
        ucExt.srcNode.setWrapper(ucExt.wrapperHT);

        await Usercontrol.Event.onReady.fireAsync([this.main, param0]);
    }
    controls: { [xname: string]: HTMLElement | HTMLElement[] };
    resizerObserver: ResizeObserver;

    finalizeInit = (param0: IUcOptions) => {
        let ext = this;
        const cssContent = ext.resource.cssContents;
        ext.srcNode.AddCss(
            ext.guid,
            cssContent,
            ext.self);
        if (ext.isDialogBox) {
            ext.Events.afterInitlize.on(param0.events.afterInitlize);
            ext.Events.afterInitlize.fire([this.main]);
        }
    }
    takeoff = () => {
        delete this.initializecomponent;
        delete this.finalizeInit;
        //delete this.ucExtends.finalizeInitAsync;
    };
    visibility: ucVisibility = 'inherit';
    getVisibility = () => {
        let ext = this;
        return (ext.isForm || ext.visibility != 'inherit') ?
            ext.visibility : ext.PARENT.ucExtends.visibility;
    }
    show = async ({ at = undefined, defaultFocusAt = undefined, decision = 'append' }:
        { at?: HTMLElement, defaultFocusAt?: HTMLElement, decision?: WhatToDoWithTargetElement, visibility?: ucVisibility } = {}) => {
        let _extend = this;
        
        let _element = _extend.initalComponents.targetElement;
        _element = at ?? _element;
        if (_element) {
            switch (decision) {
                case 'append':
                    await _element.append(_extend.wrapperHT);
                    break;
                default:
                    await _element.after(_extend.wrapperHT);
                    await _element.remove();
                    break;
            }
        }

        if (_extend.dialogForm == undefined)
            _extend.dialogForm = _extend.isForm ? this.main : _extend.PARENT.ucExtends.dialogForm;
        _extend.visibility = 'visible';
        await _extend.Events.loaded.fireAsync();
        if (defaultFocusAt)
            await TabIndexManager.focusTo(defaultFocusAt, undefined);
    }

    dialogResolver: (value: UcDialogResult) => void;
    showDialog = async ({ defaultFocusAt = undefined, at = undefined, keepCurrentVisible = true }: {
        at?: HTMLElement,
        keepCurrentVisible?: boolean,
        defaultFocusAt?: HTMLElement
    } = {}) => {
        let _extends = this;
        _extends.isDialogBox = true;
        let _parentExt = _extends.PARENT.ucExtends;
        let _oldParentVisibleValue = _parentExt.keepVisible;
        _parentExt.keepVisible = keepCurrentVisible;
        const ele = at ?? _extends.initalComponents.targetElement ?? _extends.assembly.defaultLoadAt;


        if (ele != document.body && ele?.previousElementSibling != null) {
            const puc = Usercontrol.parse(ele.previousElementSibling as HTMLElement);
            if (puc != undefined)
                puc.ucExtends.lastFocuedElement = document.activeElement as HTMLElement;
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

        _extends.visibility = 'visible';
        await _extends.Events.loaded.fireAsync();



        if (!defaultFocusAt) {
            await TabIndexManager.moveNext(_extends.self, undefined);
        } else {
            await TabIndexManager.focusTo(defaultFocusAt, undefined);
        }
        return new Promise(async (resolve: (v: UcDialogResult) => void) => {
            _extends.dialogResolver = resolve;
        });
    };
    _windowstate: UcStates = 'normal';
    get windowstate() { return this._windowstate; };
    set windowstate(state: UcStates) { this._windowstate = state; this.Events.winStateChanged.fire([state]); };
    getChildsRefByMainPath = (guid: string): Usercontrol[] => {
        let _ext = this;
        return _ext.dependant.filter(s => s.ucExtends.guid == guid);
    }
    getFirstChildRefByMainPath = (guid: string) => {
        let _ext = this;
        return _ext.dependant.find(s => s.ucExtends.guid == guid);
    }
    Events: Usercontrol$Event;



    passElement = (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions): { [xname: string]: HTMLElement | HTMLElement[] } => {
        return SourceNode.passElement(ele, this.Keys, options);
    }
    set caption(text: string) {
        this.designer.setCaption(text);
    }
    get caption() {
        return this.wrapperHT.getAttribute('x-caption');
    }
    designer = {
        setCaption: (text: string) => {
            this.wrapperHT.setAttribute("x-caption", text);
            this.Events.captionChanged.fire([text]);
        },
        getAllControls: (): { [key: string]: HTMLElement | HTMLElement[] } => {
            let childs: { [key: string]: HTMLElement | HTMLElement[] } = {};
            let uExt = this;
            let fromElement = uExt.wrapperHT;
            let uniqStamp = uExt.Keys.LOCAL;

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
    }
    distructOnClose = true;
    close = async () => {
        let _ext = this;
        let res = { prevent: false };
        await _ext.Events.beforeClose.fireAsync([res]); // _ext.Events.beforeHide
        if (!res.prevent) {
            if (_ext.distructOnClose)
                await this.destruct();
            else
                await this.hide();
        }
        if (_ext.dialogResolver != undefined) _ext.dialogResolver(_ext.DialogResult);
    };
    private hide = async () => {
        let _ext = this;
        _ext.visibility = 'hidden';
        if (_ext.isDialogBox)
            await WinManager.pop(this.main);
        await _ext.Events.afterHide.fireAsync([this.main]);
        Usercontrol.HiddenSpace.appendChild(_ext.wrapperHT);
        if (_ext.dialogResolver != undefined) _ext.dialogResolver(_ext.DialogResult);
        //debugger;
        // await this.srcNode.release();

    }
    private destruct = async (): Promise<boolean> => {
        let main = this.main;
        await this.Events.onDestruction.fireAsync();

        this.Events.afterClose.fireAsync([main]);

        if (this.isDialogBox)
            await WinManager.pop(main);

        await Usercontrol.HiddenSpace.appendChild(this.wrapperHT);
        await this.srcNode.release();
        this.wrapperHT.remove();

        requestAnimationFrame(async () => {
            for (const key in main) {
                main[key] = undefined;
            }
        });
        return false;
    }
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
