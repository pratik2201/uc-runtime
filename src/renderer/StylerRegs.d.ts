import { StyleClassScopeType } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { SourceNode } from "../lib/StampGenerator.js";
import { CssRuntimeResolver } from "./CssRuntimeResolver.js";
import { Assembly } from "./Assembly.js";
export type VariableList = {
    [key: string]: string;
};
export declare const patternList: {
    styleTagSelector: RegExp;
    subUcFatcher: RegExp;
    mediaSelector: RegExp;
    animationNamePattern: RegExp;
    animationAccessPattern: RegExp;
    varHandler: RegExp;
    rootExcludePattern: RegExp;
};
export interface IKeyStampNode {
    TEMPLATE?: string;
    LOCAL?: string;
    ROOT?: string;
    INTERNAL?: string;
}
export interface IStyleSeperatorOptions {
    data: string;
    scopeSelectorText?: string;
    callCounter?: number;
    isForRoot?: boolean;
    _assembly?: Assembly;
    localNodeElement?: HTMLElement;
}
export declare enum StyleBaseType {
    Global = 0,
    UserControl = 1,
    Template = 2,
    TemplateCommon = 3
}
export type CSSVariableScope = "global" | "local" | "internal" | "template";
export type CSSVariableScopeSort = "g" | "l" | "i" | "t";
export type CSSSearchAttributeCondition = "*" | "^" | "$";
export declare const WRAPPER_TAG_NAME: string;
export declare function dev$minifyCss(content: string): string;
export declare class StylerRegs {
    static ScssExtractor(csscontent: string): OCIterator[];
    baseType: StyleBaseType;
    KEYS: IKeyStampNode;
    controlXName: string;
    static templateID: number;
    static localID: number;
    assembly: Assembly;
    nodeName: string;
    private _parent;
    get parent(): StylerRegs;
    set parent(value: StylerRegs);
    children: StylerRegs[];
    alices: string;
    cssGuid: string;
    wrapperHT: HTMLElement;
    templateHT: HTMLElement;
    main: SourceNode;
    generateStamp: boolean;
    constructor(main: SourceNode, generateStamp: boolean, cached_keys: IKeyStampNode, baseType?: StyleBaseType, mode?: CSSSearchAttributeCondition);
    varHandler: CssVariableHandler;
    selectorHandler: SelectorHandler;
    rootAndExcludeHandler: RootAndExcludeHandler;
    cssVars: {
        key: string;
        value: string;
    }[];
    parseStyle(data: string): string;
    opnClsr: openCloser;
    static internalKey: string;
    cssResolver: CssRuntimeResolver;
    parseStyleSeperator_sub(_args: IStyleSeperatorOptions): string;
    static groupByStyler(nodes: SelSingleScopeNode[]): {
        styler: StylerRegs;
        selectors: string[];
    }[];
    pushChild(cssGuid: string, node: StylerRegs, accessKey: string): void;
}
export interface IHiddenScopeKVP {
    [key: string]: {
        selector?: string;
        funcName?: string;
        value: string;
    };
}
export interface IHiddenScopeNode {
    list: IHiddenScopeKVP;
    assembly: Assembly;
    isForRoot: boolean;
    scopeSelectorText?: string;
    counter: number;
}
export declare class RootAndExcludeHandler {
    main: StylerRegs;
    constructor(main: StylerRegs);
    rootExcludePattern: RegExp;
    checkRoot(selectorText: string, styleContent: string, _params: IStyleSeperatorOptions): string[];
}
export declare const ScopeSelectorOptions: IScopeSelectorOptions;
export interface HiddenScopeKVP {
    [key: string]: {
        selector?: string;
        funcName?: string;
        value: string;
    };
}
export interface IScopeSelectorOptions {
    selectorText: string;
    scopeSelectorText?: string;
    isForRoot: boolean;
    assembly: Assembly;
    hiddens?: IHiddenScopeNode;
}
interface SelScopeMap {
    scope?: StyleClassScopeType;
    selectorOperation?: CSSSearchAttributeCondition;
    key?: string;
}
interface SelSingleScopeNode {
    selector: string;
    styler: StylerRegs;
}
export declare class SelectorHandler {
    main: StylerRegs;
    _DEFAULT_KEYS: {
        MAIN_SELECTOR: string;
        MAIN_ROOT_SELECTOR: string;
        SCP: SelScopeMap;
    };
    private _selectorMode;
    get selectorMode(): CSSSearchAttributeCondition;
    set selectorMode(value: CSSSearchAttributeCondition);
    constructor(main: StylerRegs, mode?: CSSSearchAttributeCondition);
    updateSCP(mode: CSSSearchAttributeCondition): void;
    parseScopeSeperator(scopeOpt: IScopeSelectorOptions): SelSingleScopeNode[];
    loopMultipleSelectors(selector: string, /*stylers: StylerRegs,*/ hiddens: IHiddenScopeNode): SelSingleScopeNode[];
    KEY(hiddens: IHiddenScopeNode): string;
    splitselector(selector: string, hiddens: IHiddenScopeNode): SelSingleScopeNode;
    MISC_SELECTOR_CONDITION(selector: string, xk: SelScopeMap): string;
}
export declare class CssVariableHandler {
    static GetCombinedCSSVarName: (key: string, uniqId: string, code: CSSVariableScopeSort) => string;
    static GetCombinedCSSAnimationName: (key: string, uniqId: string, code: CSSVariableScopeSort) => string;
    static SetCSSVarValue: (vlst: VariableList, uniqId: any, code: CSSVariableScopeSort, tarEle?: HTMLElement) => void;
    static GetCSSVarValue: (key: string, uniqId: string, code: CSSVariableScopeSort, defaultVal: string) => string;
    GetCSSAnimationName: (scope: string, name: string) => string;
    main: StylerRegs;
    constructor(main: StylerRegs);
    handlerVariable(rtrn: string): string;
}
export interface OCIterator {
    frontContent: string;
    betweenContent: string;
    level: number;
    child: OCIterator[];
}
interface OpenCloseCharNode {
    openingChar: string;
    closingChar: string;
}
declare class openCloser {
    ignoreList: OpenCloseCharNode[];
    parse(oc: OpenCloseCharNode, str: string): OCIterator[];
    private isEscaped;
    doTask(openTxt: string, closeTxt: string, contents: string, callback?: (outText: string, inText: string, txtCount: number) => string): string;
}
export {};
