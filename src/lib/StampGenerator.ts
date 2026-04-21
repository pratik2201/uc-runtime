
import { CSSSearchAttributeCondition, IKeyStampNode, StyleBaseType, StylerRegs, WRAPPER_TAG_NAME } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
import { Assembly } from "../renderer/Assembly.js";
import { ATTR_OF } from "ap-shared-core/core-common.js";
import { ucUtil } from "ap-shared-core/core.js";


export enum STYLER_SELECTOR_TYPE {
    CLASS_SELECTOR = 1,
    ATTRIB_SELECTOR = 2
}


export interface IPassElementOptions {
    attechDomTree?: boolean;
    applySubTree?: boolean;
    skipTopEle?: boolean;
    groupKey?: string;
}
const PassElementOptions: IPassElementOptions = {
    applySubTree: true,
    attechDomTree: true,
    skipTopEle: false
}
class HTMLCodeNode {
    content: string;
    hasContent: boolean = false;
    hasLoadedByPath: boolean;
    originalContent: string;
    path: string;
    load(original_content: string/*, project: ProjectRow*/): boolean {
        //   debugger;
        original_content = ucUtil.devEsc(original_content);
        let hasAlreadyLoaded = this.hasContent;
        if (original_content != undefined) {
            this.originalContent = original_content;
            this.hasContent = true;
            this.hasLoadedByPath = false;
            return hasAlreadyLoaded;
        }
    }
}
class StyleCodeNode {
    originalContent: string;
    styleHT: HTMLStyleElement;
    //counter: number = 0;
    constructor() {
        this.styleHT = document.createElement("style");
        this.styleHT.type = "text/css";
        this.styleHT.setAttribute("rel", 'stylesheet');
    }
    private _content: string;
    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
        if (this.styleHT == undefined) {
            this.styleHT = document.createElement("style");

            this.styleHT.type = "text/css";
            this.styleHT.setAttribute("rel", 'stylesheet');
        }
        this.styleHT.innerHTML = this._content;
        //console.log(SourceNode.resourcesHT);

        SourceNode.resourcesHT.appendChild(this.styleHT);
    }

}

type elementAvailability = 'none' | 'before' | 'after';
export class SourceNode {
    counter = 0;
    //get templateStamp(): string { return this.styler.KEYS.TEMPLATE; }
    get localStamp(): string { return this.styler.KEYS.LOCAL; }
    objectKey: string = "";
    accessKey: string = '';
    htmlCode: HTMLCodeNode = new HTMLCodeNode();
    styler: StylerRegs;
    onRelease = [] as (() => void)[]
    dataHT: HTMLElement;
    addChildAccessInParentNode = ({ parentSrc, wrapper, key, accessName }: {
        parentSrc: SourceNode,
        wrapper: HTMLElement, key: string, accessName: string
    }) => {
        this.styler.controlXName = accessName;
        this.styler.wrapperHT = wrapper;
        parentSrc.styler.pushChild(key, this.styler, accessName);
    }
    assembly: Assembly;
    //project: ProjectRowR;
    cssObj: { [key: string]: StyleCodeNode } = {};
    AddCss(key: string, cssContent: string, localNodeElement?: HTMLElement) {
        if (cssContent == undefined) {
            console.warn('cssContent not provided in `SourceNode.AddCss`');
            return;
        }
        let csnd = this.cssObj[key];
        if (csnd == undefined) {
            cssContent = ucUtil.devEsc(cssContent);
            let ccontent = this.styler.parseStyleSeperator_sub({
                data: cssContent,
                localNodeElement: localNodeElement,
            })
            let newcssCode: StyleCodeNode = new StyleCodeNode();
            newcssCode.originalContent = cssContent;
            newcssCode.content = ccontent;
            newcssCode.styleHT.setAttribute('a-key', this.objectKey);
            this.cssObj[key] = newcssCode;
        }
    }


    static resourcesHT: HTMLElement;
    static init() {
        this.resourcesHT = document.createElement("programres");
        this.resourcesHT.setAttribute("stamp", 'program.stamp');
        document.head.appendChild(this.resourcesHT);
    }
    static ExtendControlObject(rtrn: {}, xname: string, ctr: any, ignoreEmpty: boolean = true) {
        if (ignoreEmpty) {
            if (xname == null || xname.length == 0) return;
        }
        let xctr = rtrn[xname];
        if (xctr == undefined)
            rtrn[xname] = ctr;
        else {
            if (xctr.getType() == 'Array') {
                (xctr as any as HTMLElement[]).push(ctr);
            } else {
                rtrn[xname] = [xctr] as any;
            }
        }
    }
    setWrapper(ele: HTMLElement) {
        const k = this.styler.KEYS;
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.CLASS_SELECTOR) {
            SourceNode.clearUcStyleClasses(ele);
            ele.classList.add(ATTR_OF.__CLASS(k.LOCAL, 'm'), ATTR_OF.__CLASS(k.ROOT, 'r'));
        } else {
            ele.setAttribute(ATTR_OF.UC.ALL, `${k.LOCAL}_${k.ROOT}`);
        }
    }
    static copyUcStyleClassesTo(_this: HTMLElement, ...to: HTMLElement[]) {
        let clst = (Array.from(_this.classList)).filter(s => s.startsWith(ATTR_OF.UC.ALLC));
        to.forEach(d => {
            d.classList.add(...clst);
        });
    }
    static clearUcStyleClasses(ele: HTMLElement) {
        ele.classList.remove(...(Array.from(ele.classList)).filter(s => s.startsWith(ATTR_OF.UC.ALLC)));
    }
    static passElement = <A = HTMLElement | HTMLElement[]>(ele: A, key: IKeyStampNode, options?: IPassElementOptions): { [xname: string]: HTMLElement | HTMLElement[] } => {
        options = Object.assign(Object.assign({}, PassElementOptions), options);
        let stamplist: string[] = [];
        let rtrn: { [xname: string]: HTMLElement } = {};
        let xnameAtrr = undefined;
        let _CLASSES: string[] = [];
        let h: HTMLElement;
        let stmpUnq: string = key.LOCAL;// this.localStamp;
        let stmpRt = '' + key.ROOT;  //this.assembly.id;//this.root.id;
        let ar = ucUtil.getArray(ele);
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            let keyToSet = options.groupKey != undefined ?
                stmpUnq + "_" + options.groupKey + "_" + stmpRt
                :
                stmpUnq + "_" + stmpRt;
            for (let i = 0, ilen = ar.length; i < ilen; i++) {
                const element: HTMLElement = ar[i];
                if (!options.skipTopEle) {
                    element.setAttribute(ATTR_OF.UC.ALL, keyToSet);
                    SourceNode.ExtendControlObject(rtrn, element.getAttribute(ATTR_OF.X_NAME), element);
                }
                if (options.applySubTree) {
                    let eles = element.querySelectorAll("*");
                    eles
                        .forEach((s) => {
                            s.setAttribute(ATTR_OF.UC.ALL, keyToSet);
                            SourceNode.ExtendControlObject(rtrn, s.getAttribute(ATTR_OF.X_NAME), s);
                        });
                }
            }
        } else {

            _CLASSES.push(ATTR_OF.__CLASS(stmpRt, 'r'), ATTR_OF.__CLASS(stmpUnq, 'l'))
            if (options.groupKey != undefined)
                _CLASSES.push(ATTR_OF.__CLASS(options.groupKey, 'g'))

            for (let i = 0, ilen = ar.length; i < ilen; i++) {
                const element: HTMLElement = ar[i];
                if (!options.skipTopEle) {
                    element.classList.add(..._CLASSES);
                    SourceNode.ExtendControlObject(rtrn, element.getAttribute(ATTR_OF.X_NAME), element);
                }
                if (options.applySubTree) {
                    let eles = element.querySelectorAll("*");
                    eles
                        .forEach((s) => {
                            s.classList.add(..._CLASSES);
                            SourceNode.ExtendControlObject(rtrn, s.getAttribute(ATTR_OF.X_NAME), s);
                        });
                }
            }
        }

        return rtrn;
    }
    static transferAttributes(fromEl: HTMLElement, toEl: HTMLElement) {
        for (const attr of [...fromEl.attributes]) {
            toEl.setAttribute(attr.name, attr.value);
        }
    }
    static tramsformForm(htnode: HTMLElement) {
        let rtrn = document.createElement(WRAPPER_TAG_NAME);
        SourceNode.transferAttributes(htnode, rtrn);
        rtrn.append(...htnode.childNodes);
        return rtrn;
    }
    loadHTML(htmlContent: string, setTabindex = true) {
        let isAlreadyExist = this.htmlCode.load(htmlContent);
        if (isAlreadyExist) return;
        let htCode = this.htmlCode;
        htCode.content = this.styler.parseStyle(htCode.originalContent);
        this.dataHT = SourceNode.tramsformForm(ucUtil.PHP_REMOVE(htCode.content)["#$"]());

        this.styler.nodeName = WRAPPER_TAG_NAME;// this.dataHT.nodeName;
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            this.dataHT.setAttribute(ATTR_OF.UC.ALL, this.localStamp);
        } else {
            this.dataHT.classList.add(ATTR_OF.__CLASS(this.localStamp, 'm'));
        }
        htCode.content = this.dataHT.outerHTML;
        if (setTabindex && !this.dataHT.hasAttribute('x-tabindex')) {
            this.dataHT.setAttribute('x-tabindex', '-1');
        }
        htCode.content = this.dataHT.outerHTML;
        htCode.content = ucUtil.PHP_ADD(htCode.content);
    }
    release = async () => {
        const states = await SourceNode.deregisterHTML(this.objectKey);
        if ((states)) {

            if (this.cssObj == undefined) {
                console.warn([this.objectKey, '`cssObj` is undefined']);
                return;
            }
            let keys = Object.keys(this.cssObj);
            for (let i = 0, iObj = keys, ilen = iObj.length; i < ilen; i++)
                this.cssObj[iObj[i]].styleHT.remove();
            for (let i = 0, iObj = this.onRelease, ilen = iObj.length; i < ilen; i++)
                iObj[i]();

            this.dataHT =
                this.htmlCode = this.cssObj = undefined;

            let _styler = SourceNode.cssSource[this.objectKey].styler;
            if (SourceNode.cacheData[this.objectKey] == undefined)
                SourceNode.cacheData[this.objectKey] = Object.assign({}, _styler.KEYS);
            delete SourceNode.cssSource[this.objectKey];
        }
    }
    static MODE: STYLER_SELECTOR_TYPE = STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR;
    static cssSource: { [key: string]: SourceNode; } = {};

    static cacheData: {
        [key: string]: IKeyStampNode
    } = {};
    static registerSource({ objectKey,
        accessName = '', cssKeyStamp,
        mode = '^', baseType = StyleBaseType.UserControl, assembly, generateStamp = true }: {
            objectKey: string, accessName?: string,
            cssKeyStamp?: IKeyStampNode,
            assembly: Assembly,
            baseType?: StyleBaseType,
            mode?: CSSSearchAttributeCondition,
            generateStamp?: boolean, // project: ProjectRowR,
        }): SourceNode {

        let rtrn: SourceNode = SourceNode.cssSource[objectKey];
        if (rtrn == undefined) {
            rtrn = new SourceNode();
            rtrn.assembly = assembly;
            rtrn.objectKey = objectKey;
            rtrn.accessKey = accessName;
            SourceNode.cssSource[objectKey] = rtrn;
            rtrn.styler = new StylerRegs(rtrn, generateStamp, cssKeyStamp ?? SourceNode.cacheData[objectKey], baseType, mode);

        }
        rtrn.counter++;
        return rtrn;
    }
    static deregisterHTML = async (objectKey: string) => {
        let result = false;
        let rtrn: SourceNode = SourceNode.cssSource[objectKey];
        if (rtrn != undefined) {
            rtrn.counter--;
            result = (rtrn.counter <= 0);
        }
        return result;
    }
}
export class FilterContent {
    static select_inline_Pattern: RegExp = /(["=> \w\[\]-^|#~$*.+]*)(::|:)([-\w\(\)]+)/g;

    static select_inline_filter(data: string, _guid: string = ""): string {
        let rtrn: string = "";
        let isReplaced: boolean = false;
        rtrn = data.replace(this.select_inline_Pattern, function (
            match: string,
            selector: string,
            seperator: string,
            pseudo: string,
            offset: number,
            input_string: string
        ): string {
            isReplaced = true;
            return (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) ?
                data.trim() + `[${ATTR_OF.UC.ALL}^='${_guid}_']`
                :
                data.trim() + `.${ATTR_OF.__CLASS(_guid, 'l')}`;
            //return `${selector.trim()}.${ATTR_OF.__CLASS(_guid, 'l')}${seperator}${pseudo}`;
        });
        if (isReplaced) return rtrn;
        return (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) ?
            data.trim() + `[${ATTR_OF.UC.ALL}^='${_guid}_']`
            :
            data.trim() + `.${ATTR_OF.__CLASS(_guid, 'l')}`;
        return; // old one `[${ATTR_OF.UC.UNIQUE_STAMP}='${_guid}']`
    }
}