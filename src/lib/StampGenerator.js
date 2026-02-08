import { ucUtil, ATTR_OF } from "ap-shared-core/out/ucbuilder/ucUtil.js";
import { StyleBaseType, StylerRegs, WRAPPER_TAG_NAME } from "../renderer/StylerRegs.js";
export var STYLER_SELECTOR_TYPE;
(function (STYLER_SELECTOR_TYPE) {
    STYLER_SELECTOR_TYPE[STYLER_SELECTOR_TYPE["CLASS_SELECTOR"] = 1] = "CLASS_SELECTOR";
    STYLER_SELECTOR_TYPE[STYLER_SELECTOR_TYPE["ATTRIB_SELECTOR"] = 2] = "ATTRIB_SELECTOR";
})(STYLER_SELECTOR_TYPE || (STYLER_SELECTOR_TYPE = {}));
const PassElementOptions = {
    applySubTree: true,
    attechDomTree: true,
    skipTopEle: false
};
class HTMLCodeNode {
    content;
    hasContent = false;
    hasLoadedByPath;
    originalContent;
    path;
    load(original_content /*, project: ProjectRow*/) {
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
    originalContent;
    styleHT;
    counter = 0;
    constructor() {
        this.styleHT = document.createElement("style");
        this.styleHT.type = "text/css";
        this.styleHT.setAttribute("rel", 'stylesheet');
    }
    _content;
    get content() {
        return this._content;
    }
    set content(value) {
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
export class SourceNode {
    isNewSource = true;
    counter = 0;
    get templateStamp() { return this.styler.KEYS.TEMPLATE; }
    get localStamp() { return this.styler.KEYS.LOCAL; }
    myObjectKey = "";
    accessKey = '';
    htmlCode = new HTMLCodeNode();
    styler;
    onRelease = [];
    dataHT;
    //rootFilePath: string = '';
    config = ({ parentSrc, parentUc, wrapper, key, accessName }) => {
        this.styler.controlXName = accessName;
        this.styler.wrapperHT = wrapper;
        parentSrc.styler.pushChild(key, this.styler, accessName);
    };
    assembly;
    //project: ProjectRowR;
    cssObj = {};
    pushCSSByContent(key, cssContent, localNodeElement) {
        if (cssContent == undefined)
            return;
        let csnd = this.cssObj[key];
        cssContent = ucUtil.devEsc(cssContent);
        let ccontent = this.styler.parseStyleSeperator_sub({
            data: cssContent, // _assembly: this.assembly,  //  NEW  ADDED 
            localNodeElement: localNodeElement,
        });
        if (csnd == undefined) {
            let newcssCode = new StyleCodeNode();
            newcssCode.originalContent = cssContent;
            newcssCode.content = ccontent;
            newcssCode.styleHT.setAttribute('a-key', this.myObjectKey);
            // console.log(this.cssObj);
            this.cssObj[key] = newcssCode;
        }
    }
    pushCSS(cssGuid, cssContent, localNodeElement) {
        if (cssContent == undefined) {
            console.warn('cssContent not provided in `SourceNode.pushCSS`');
            return;
        }
        this.pushCSSByContent(cssGuid, cssContent, localNodeElement);
    }
    static resourcesHT = document.createElement("programres");
    static init() {
        this.resourcesHT.setAttribute("stamp", 'program.stamp');
        document.head.appendChild(this.resourcesHT);
    }
    static ExtendControlObject(rtrn, xname, ctr, ignoreEmpty = true) {
        if (ignoreEmpty) {
            if (xname == null || xname.length == 0)
                return;
        }
        let xctr = rtrn[xname];
        if (xctr == undefined)
            rtrn[xname] = ctr;
        else {
            if (xctr.getType() == 'Array') {
                xctr.push(ctr);
            }
            else {
                rtrn[xname] = [xctr];
            }
        }
    }
    setWrapper(ele) {
        const k = this.styler.KEYS;
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.CLASS_SELECTOR) {
            ele["#clearUcStyleClasses"]();
            ele.classList.add(ATTR_OF.__CLASS(k.LOCAL, 'm'), ATTR_OF.__CLASS(k.ROOT, 'r'));
        }
        else {
            ele.setAttribute(ATTR_OF.UC.ALL, `${k.LOCAL}_${k.ROOT}`);
        }
    }
    passElement = (ele, options) => {
        options = Object.assign(Object.assign({}, PassElementOptions), options);
        let stamplist = [];
        let rtrn = {};
        let xnameAtrr = undefined;
        let _CLASSES = [];
        let h;
        let stmpUnq = this.localStamp;
        let stmpRt = '' + this.assembly.id; //this.root.id;
        let ar = ucUtil.getArray(ele);
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            let keyToSet = options.groupKey != undefined ?
                stmpUnq + "_" + options.groupKey + "_" + stmpRt
                :
                    stmpUnq + "_" + stmpRt;
            for (let i = 0, ilen = ar.length; i < ilen; i++) {
                const element = ar[i];
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
        }
        else {
            _CLASSES.push(ATTR_OF.__CLASS(stmpRt, 'r'), ATTR_OF.__CLASS(stmpUnq, 'l'));
            if (options.groupKey != undefined)
                _CLASSES.push(ATTR_OF.__CLASS(options.groupKey, 'g'));
            for (let i = 0, ilen = ar.length; i < ilen; i++) {
                const element = ar[i];
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
    };
    static transferAttributes(fromEl, toEl) {
        for (const attr of [...fromEl.attributes]) {
            toEl.setAttribute(attr.name, attr.value);
        }
    }
    static tramsformForm(htnode) {
        let rtrn = document.createElement(WRAPPER_TAG_NAME);
        SourceNode.transferAttributes(htnode, rtrn);
        rtrn.append(...htnode.childNodes);
        return rtrn;
    }
    loadHTML(setTabindex = true /*callback = (s: string) => s*/) {
        let htCode = this.htmlCode;
        htCode.content = this.styler.parseStyle(htCode.originalContent);
        //if (callback != undefined) htCode.content = callback(htCode.content);
        this.dataHT = SourceNode.tramsformForm(ucUtil.PHP_REMOVE(htCode.content)["#$"]());
        this.styler.nodeName = WRAPPER_TAG_NAME; // this.dataHT.nodeName;
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            this.dataHT.setAttribute(ATTR_OF.UC.ALL, this.localStamp);
        }
        else {
            this.dataHT.classList.add(ATTR_OF.__CLASS(this.localStamp, 'm'));
        }
        htCode.content = this.dataHT.outerHTML;
        if (setTabindex && !this.dataHT.hasAttribute('x-tabindex')) {
            this.dataHT.setAttribute('x-tabindex', '-1');
        }
        htCode.content = this.dataHT.outerHTML;
        htCode.content = ucUtil.PHP_ADD(htCode.content); //["#PbHP_ADD"](); //.replace(/<!--\?(=|php)(.*?)\?-->/gm, '<?$1$2?>');
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
    };
    static MODE = STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR;
    static childs = {};
    static cacheData = {};
    static registerSource({ key, accessName = '', cssKeyStamp, mode = '^', baseType = StyleBaseType.UserControl, 
    /* project,*/ assembly, generateStamp = true }) {
        //console.log(key);
        let myObjectKey = key; //this.GetKey(key, alices);
        let rtrn = SourceNode.childs[myObjectKey];
        if (rtrn == undefined) {
            rtrn = new SourceNode();
            //rtrn.project = project;
            rtrn.assembly = assembly; // ?? AssemblyManager.Parse(key)
            rtrn.myObjectKey = myObjectKey;
            rtrn.accessKey = accessName;
            SourceNode.childs[myObjectKey] = rtrn;
            rtrn.styler = new StylerRegs(rtrn, generateStamp, cssKeyStamp ?? SourceNode.cacheData[myObjectKey], baseType, mode);
            //console.log(SourceNode.childs);
        }
        else
            rtrn.isNewSource = false;
        rtrn.counter++;
        //console.log([rtrn.counter,'open',myObjectKey]);
        return rtrn;
    }
    static deregisterSource = async (key) => {
        let result = false;
        let myObjectKey = key;
        let rtrn = SourceNode.childs[myObjectKey];
        if (rtrn != undefined) {
            rtrn.counter--;
            result = (rtrn.counter <= 0);
        }
        return result; //{ result: result, count: rtrn.counter };
    };
}
export class FilterContent {
    static select_inline_Pattern = /(["=> \w\[\]-^|#~$*.+]*)(::|:)([-\w\(\)]+)/g;
    static select_inline_filter(data, _guid = "") {
        let rtrn = "";
        let isReplaced = false;
        rtrn = data.replace(this.select_inline_Pattern, function (match, selector, seperator, pseudo, offset, input_string) {
            isReplaced = true;
            return (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) ?
                data.trim() + `[${ATTR_OF.UC.ALL}^='${_guid}_']`
                :
                    data.trim() + `.${ATTR_OF.__CLASS(_guid, 'l')}`;
            //return `${selector.trim()}.${ATTR_OF.__CLASS(_guid, 'l')}${seperator}${pseudo}`;
        });
        if (isReplaced)
            return rtrn;
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
//# sourceMappingURL=StampGenerator.js.map