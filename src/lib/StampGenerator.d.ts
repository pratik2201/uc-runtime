import { Assembly } from "ap-shared-core/out/ucbuilder/Assembly.js";
import { CSSSearchAttributeCondition, IKeyStampNode, StyleBaseType, StylerRegs } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
export declare enum STYLER_SELECTOR_TYPE {
    CLASS_SELECTOR = 1,
    ATTRIB_SELECTOR = 2
}
export interface IPassElementOptions {
    attechDomTree?: boolean;
    applySubTree?: boolean;
    skipTopEle?: boolean;
    groupKey?: string;
}
declare class HTMLCodeNode {
    content: string;
    hasContent: boolean;
    hasLoadedByPath: boolean;
    originalContent: string;
    path: string;
    load(original_content: string): boolean;
}
declare class StyleCodeNode {
    originalContent: string;
    styleHT: HTMLStyleElement;
    counter: number;
    constructor();
    private _content;
    get content(): string;
    set content(value: string);
}
export declare class SourceNode {
    isNewSource: boolean;
    counter: number;
    get templateStamp(): string;
    get localStamp(): string;
    myObjectKey: string;
    accessKey: string;
    htmlCode: HTMLCodeNode;
    styler: StylerRegs;
    onRelease: (() => void)[];
    dataHT: HTMLElement;
    config: ({ parentSrc, parentUc, wrapper, key, accessName }: {
        parentSrc: SourceNode;
        parentUc: Usercontrol;
        wrapper: HTMLElement;
        key: string;
        accessName: string;
    }) => void;
    assembly: Assembly;
    cssObj: {
        [key: string]: StyleCodeNode;
    };
    pushCSSByContent(key: string, cssContent: string, localNodeElement?: HTMLElement): void;
    pushCSS(cssGuid: string, cssContent: string, localNodeElement?: HTMLElement): void;
    static resourcesHT: HTMLElement;
    static init(): void;
    static ExtendControlObject(rtrn: {}, xname: string, ctr: any, ignoreEmpty?: boolean): void;
    setWrapper(ele: HTMLElement): void;
    passElement: <A = HTMLElement | HTMLElement[]>(ele: A, options?: IPassElementOptions) => {
        [xname: string]: HTMLElement | HTMLElement[];
    };
    static transferAttributes(fromEl: HTMLElement, toEl: HTMLElement): void;
    static tramsformForm(htnode: HTMLElement): HTMLElement;
    loadHTML(setTabindex?: boolean): void;
    release: () => Promise<void>;
    static MODE: STYLER_SELECTOR_TYPE;
    static childs: {
        [key: string]: SourceNode;
    };
    static cacheData: {
        [key: string]: IKeyStampNode;
    };
    static registerSource({ key, accessName, cssKeyStamp, mode, baseType, assembly, generateStamp }: {
        key: string;
        accessName?: string;
        cssKeyStamp?: IKeyStampNode;
        assembly: Assembly;
        baseType?: StyleBaseType;
        mode?: CSSSearchAttributeCondition;
        generateStamp?: boolean;
    }): SourceNode;
    static deregisterSource: (key: string) => Promise<boolean>;
}
export declare class FilterContent {
    static select_inline_Pattern: RegExp;
    static select_inline_filter(data: string, _guid?: string): string;
}
export {};
