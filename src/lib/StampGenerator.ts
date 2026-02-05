
import { ucUtil, ATTR_OF } from "ap-shared-core/out/ucbuilder/ucUtil.js";
import { Assembly } from "../main/Assembly.js";
import { CSSSearchAttributeCondition, IKeyStampNode, StyleBaseType, StylerRegs, WRAPPER_TAG_NAME } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";


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
    counter: number = 0;
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
    isNewSource = true;
    counter = 0;
    get templateStamp(): string { return this.styler.KEYS.TEMPLATE; }
    get localStamp(): string { return this.styler.KEYS.LOCAL; }
    myObjectKey: string = "";
    accessKey: string = '';
    htmlCode: HTMLCodeNode = new HTMLCodeNode();
    styler: StylerRegs;
    onRelease = [] as (() => void)[]
    dataHT: HTMLElement;
    //rootFilePath: string = '';
    config = ({ parentSrc, parentUc, wrapper, key, accessName }: {
        parentSrc: SourceNode, parentUc: Usercontrol,
        wrapper: HTMLElement, key: string, accessName: string
    }) => {
        this.styler.controlXName = accessName;
        this.styler.wrapperHT = wrapper;
        parentSrc.styler.pushChild(key, this.styler, accessName);
    }
    assembly: Assembly;
    //project: ProjectRowR;
    cssObj: { [key: string]: StyleCodeNode } = {};
    pushCSSByContent(key: string, cssContent: string, localNodeElement?: HTMLElement) {
        if (cssContent == undefined) return;
        let csnd = this.cssObj[key];
        cssContent = ucUtil.devEsc(cssContent);
        let ccontent = this.styler.parseStyleSeperator_sub({
            data: cssContent, // _assembly: this.assembly,  //  NEW  ADDED 
            localNodeElement: localNodeElement,
        })
        if (csnd == undefined) {
            let newcssCode: StyleCodeNode = new StyleCodeNode();
            newcssCode.originalContent = cssContent;
            newcssCode.content = ccontent;
            newcssCode.styleHT.setAttribute('a-key', this.myObjectKey);
            // console.log(this.cssObj);
            this.cssObj[key] = newcssCode;
        }
    }

    pushCSS(cssGuid: string, cssContent: string, localNodeElement?: HTMLElement) {
        if (cssContent == undefined) {
            console.warn('cssContent not provided in `SourceNode.pushCSS`');
            return;
        }
        this.pushCSSByContent(
            cssGuid,
            cssContent,
            localNodeElement
        );
    }
    static resourcesHT: HTMLElement = document.createElement("programres");
    static init() {
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
            ele["#clearUcStyleClasses"]();
            ele.classList.add(ATTR_OF.__CLASS(k.LOCAL, 'm'), ATTR_OF.__CLASS(k.ROOT, 'r'));
        } else {
            ele.setAttribute(ATTR_OF.UC.ALL, `${k.LOCAL}_${k.ROOT}`);
        }
    }
    passElement = <A = HTMLElement | HTMLElement[]>(ele: A, options?: IPassElementOptions): { [xname: string]: HTMLElement | HTMLElement[] } => {
        options = Object.assign(Object.assign({}, PassElementOptions), options);
        let stamplist: string[] = [];
        let rtrn: { [xname: string]: HTMLElement } = {};
        let xnameAtrr = undefined;
        let _CLASSES: string[] = [];
        let h: HTMLElement;
        let stmpUnq: string = this.localStamp;
        let stmpRt = '' + this.assembly.id;//this.root.id;
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
    loadHTML(setTabindex = true/*callback = (s: string) => s*/) {
        let htCode = this.htmlCode;
        htCode.content = this.styler.parseStyle(htCode.originalContent);
        //if (callback != undefined) htCode.content = callback(htCode.content);
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
        htCode.content = ucUtil.PHP_ADD(htCode.content);//["#PbHP_ADD"](); //.replace(/<!--\?(=|php)(.*?)\?-->/gm, '<?$1$2?>');


    }
    release = async () => {
        const states = await SourceNode.deregisterSource(this.myObjectKey);
        if ((states)) {

            if (this.cssObj == undefined) {
                ///   console.log(['stamp result', states.count]);
                console.warn([this.myObjectKey, '`cssObj` is undefined']);
                return;
            }
            let keys = Object.keys(this.cssObj);
            for (let i = 0, iObj = keys, ilen = iObj.length; i < ilen; i++)
                this.cssObj[iObj[i]].styleHT.remove();
            for (let i = 0, iObj = this.onRelease, ilen = iObj.length; i < ilen; i++)
                iObj[i]();

            this.dataHT =
                this.htmlCode = this.cssObj = undefined;

            let _styler = SourceNode.childs[this.myObjectKey].styler;
            if (SourceNode.cacheData[this.myObjectKey] == undefined)
                SourceNode.cacheData[this.myObjectKey] = Object.assign({}, _styler.KEYS);
            delete SourceNode.childs[this.myObjectKey];
        }
    }
    static MODE: STYLER_SELECTOR_TYPE = STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR;
    static childs: { [key: string]: SourceNode; } = {};

    static cacheData: {
        [key: string]: IKeyStampNode
    } = {};
    static registerSource({ key,
        accessName = '', cssKeyStamp,
        mode = '^', baseType = StyleBaseType.UserControl,
       /* project,*/ assembly, generateStamp = true }: {
            key: string, accessName?: string,
            cssKeyStamp?: IKeyStampNode,
            assembly: Assembly,
            baseType?: StyleBaseType,
            mode?: CSSSearchAttributeCondition,
            generateStamp?: boolean, // project: ProjectRowR,
        }): SourceNode {
        //console.log(key);

        let myObjectKey = key; //this.GetKey(key, alices);
        let rtrn: SourceNode = SourceNode.childs[myObjectKey];
        if (rtrn == undefined) {
            rtrn = new SourceNode();
            //rtrn.project = project;
            rtrn.assembly = assembly;// ?? AssemblyManager.Parse(key)
            rtrn.myObjectKey = myObjectKey;
            rtrn.accessKey = accessName;
            SourceNode.childs[myObjectKey] = rtrn;
            rtrn.styler = new StylerRegs(rtrn, generateStamp, cssKeyStamp ?? SourceNode.cacheData[myObjectKey], baseType, mode);
            //console.log(SourceNode.childs);

        } else rtrn.isNewSource = false;
        rtrn.counter++;
        //console.log([rtrn.counter,'open',myObjectKey]);
        return rtrn;
    }
    static deregisterSource = async (key: string) => {
        let result = false;
        let myObjectKey = key;
        let rtrn: SourceNode = SourceNode.childs[myObjectKey];

        if (rtrn != undefined) {
            rtrn.counter--;
            result = (rtrn.counter <= 0);
        }
        return result; //{ result: result, count: rtrn.counter };
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

// export class StampNode {
//     static MODE: STYLER_SELECTOR_TYPE = STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR;
//     static dataHT: HTMLElement;
//     static GetKey(key: string, alice: string) { return key + "@" + alice; }
//     static childs: { [key: string]: SourceNode; } = {};
//     static cacheData: {
//         [key: string]: IKeyStampNode
//     } = {};

//     static registerSource({ key,
//         accessName = '', cssKeyStamp,
//         mode = '^', baseType = StyleBaseType.UserControl,
//         cssFilePath = undefined, project, /*root,*/ generateStamp = true }: {
//             key: string, accessName?: string, /*root?: RootPathRow,*/
//             cssFilePath?: string,
//             cssKeyStamp?: IKeyStampNode,
//             baseType?: StyleBaseType,
//             mode?: CSSSearchAttributeCondition,
//             generateStamp?: boolean, project: ProjectRowR,
//         }): SourceNode {
//         //console.log(key);

//         let myObjectKey = key; //this.GetKey(key, alices);
//         let rtrn: SourceNode = SourceNode.childs[myObjectKey];
//         if (rtrn == undefined) {
//             rtrn = new SourceNode();
//             rtrn.project = project;
//             rtrn.cssFilePaeth = cssFilePath;
//             rtrn.myObjectKey = myObjectKey;
//             rtrn.accessKey = accessName;
//             SourceNode.childs[myObjectKey] = rtrn;
//             rtrn.styler = new StylerRegs(rtrn, generateStamp, cssKeyStamp ?? SourceNode.cacheData[myObjectKey], baseType, mode);
//         } else rtrn.isNewSource = false;
//         rtrn.counter++;
//         //console.log([rtrn.counter,'open',myObjectKey]);
//         return rtrn;
//     }
//     static deregisterSource = async (key: string) => {
//         let result = false;
//         let myObjectKey = key;
//         let rtrn: SourceNode = SourceNode.childs[myObjectKey];
//         if (rtrn != undefined) {
//             rtrn.counter--;
//             result = (rtrn.counter <= 0);
//         }
//         return result; //{ result: result, count: rtrn.counter };
//     }
// }