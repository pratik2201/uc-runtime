import { ATTR_OF, GetUniqueId, ucUtil } from "ap-shared-core/out/uc-control/ucUtil.js";
import { SourceNode, STYLER_SELECTOR_TYPE } from "../lib/StampGenerator.js";
import { CssRuntimeResolver } from "./CssRuntimeResolver.js";
import { AssemblyManager } from "./Assembly.js";
export const patternList = {
    styleTagSelector: /<style([\n\r\w\W.]*?)>([\n\r\w\W.]*?)<\/style>/gi,
    subUcFatcher: /\[inside=([\"'`])((?:\\.|(?!\1)[^\\])*)\1\]([\S\s]*)/gim, // [done]
    mediaSelector: /^\s*@(media|keyframes|supports|container|document)\s+([\s\S]*)\s*/i,
    animationNamePattern: /animation-name\s*:\s*-([lgit])-(\w+)\s*;/gim,
    animationAccessPattern: /-([lgit])-(\w+)\s*/gim,
    varHandler: /(\$[lgit]-\w+)((?:\s*\:\s*(.*?)\s*;)|(?:\s+(.+?)\s*--)|\s*)/gim,
    rootExcludePattern: /([a-z0-9@_-]*)(:root|:exclude)/gi,
};
const StyleSeperatorOptions = {
    data: "",
    scopeSelectorText: "",
    callCounter: 0,
    isForRoot: false,
    //_rootinfo: Object.assign({}, rootPathRow),
    //_projectinfo: new ProjectRowR(),
    _assembly: undefined,
    localNodeElement: undefined,
    //cssVarStampKey: "",
};
export var StyleBaseType;
(function (StyleBaseType) {
    StyleBaseType[StyleBaseType["Global"] = 0] = "Global";
    StyleBaseType[StyleBaseType["UserControl"] = 1] = "UserControl";
    StyleBaseType[StyleBaseType["Template"] = 2] = "Template";
    StyleBaseType[StyleBaseType["TemplateCommon"] = 3] = "TemplateCommon";
})(StyleBaseType || (StyleBaseType = {}));
export const WRAPPER_TAG_NAME = 'f' + GetUniqueId();
export function dev$minifyCss(content) {
    content = (content.replace(/\/\*([\s\S]*?)\*\//gi, "")
        .replace(/\/\/.*/mg, "")).replace(/(;|,|:|{|})[\n\r ]*/gi, "$1");
    return content;
}
// export function dev$Use_loader(content: string, cssFilePath: string) {
//   content = content.replace(/@use\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1\s*;/gim,
//     (match: string, quationMark: string, path: string, offset: any, input_string: string) => {
//       let themecontents = '';
//       if (cssFilePath != undefined) {
//         const useFilePath = nodeFn.path.resolveFilePath(cssFilePath, path);
//         if (nodeFn.fs.existsSync(useFilePath)) {
//           themecontents = ucUtil.devEsc(nodeFn.fs.readFileSync(useFilePath));
//           if (themecontents != undefined) {
//             try {
//               themecontents = dev$Use_loader(themecontents, useFilePath);
//             } catch (ex) {
//               debugger;
//               console.log(ex);
//             }
//           }
//         }
//       }
//       return themecontents;
//     }
//   );
//   return content;
// }
export class StylerRegs {
    static ScssExtractor(csscontent) {
        let ocHandler = new openCloser();
        ocHandler.ignoreList.push({ openingChar: `"`, closingChar: `"` }, { openingChar: `'`, closingChar: `'` }, { openingChar: "`", closingChar: "`" }, { openingChar: "/*", closingChar: "*/" });
        return ocHandler.parse({ openingChar: '{', closingChar: '}' }, csscontent);
    }
    baseType = StyleBaseType.UserControl;
    KEYS = {
        TEMPLATE: "",
        LOCAL: "",
        ROOT: "",
        INTERNAL: "",
    };
    controlXName = '';
    static templateID = 0;
    static localID = 0;
    //projectInfo: ProjectRowR = undefined;
    assembly = undefined;
    nodeName = WRAPPER_TAG_NAME;
    _parent = undefined;
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
        this.KEYS.INTERNAL = 'IK'; //this.KEYS.LOCAL;
        /*if (this.generateStamp) {
          this.KEYS.INTERNAL = 'IK'; //this.KEYS.LOCAL;
        } else {
          this.KEYS.INTERNAL = 'IK'; //this._parent.KEYS.LOCAL
        }*/
    }
    children = [];
    alices = "";
    cssGuid = "";
    wrapperHT = undefined;
    templateHT = undefined;
    main;
    generateStamp = true;
    constructor(main, generateStamp = true, cached_keys, baseType, mode) {
        this.main = main;
        this.generateStamp = generateStamp;
        this.assembly = main.assembly;
        //this.projectInfo = main.project;
        this.baseType = baseType;
        this.opnClsr.ignoreList = [
            { openingChar: `"`, closingChar: `"` },
            { openingChar: `'`, closingChar: `'` },
            { openingChar: "`", closingChar: "`" },
        ];
        if (cached_keys == undefined) {
            StylerRegs.localID++;
            if (generateStamp) {
                StylerRegs.templateID++;
            }
            this.KEYS.ROOT = "" + this.assembly.id;
            this.KEYS.TEMPLATE = "" + StylerRegs.templateID;
            this.KEYS.LOCAL = "" + StylerRegs.localID;
        }
        else {
            this.KEYS = Object.assign({}, cached_keys);
            console.log(['  ------  CACHE RESTORED ', this.main.myObjectKey]);
        }
        //if (this.KEYS.LOCAL == '25') debugger;
        this.KEYS.INTERNAL = "";
        this.nodeName = WRAPPER_TAG_NAME; //"f" + uniqOpt.randomNo();
        this.rootAndExcludeHandler = new RootAndExcludeHandler(this);
        //this.themeCssHandler = new ThemeCssHandler(this);
        this.varHandler = new CssVariableHandler(this);
        this.selectorHandler = new SelectorHandler(this, mode);
    }
    varHandler;
    selectorHandler;
    rootAndExcludeHandler;
    //themeCssHandler: ThemeCssHandler;
    cssVars = [];
    parseStyle(data) {
        let _this = this;
        let rtrn = data;
        rtrn = rtrn.replace(patternList.styleTagSelector, function (match, styleAttrs, styleContent, offset, input_string) {
            return `<style ${styleAttrs}> ${_this.parseStyleSeperator_sub({
                data: styleContent,
            })} </style>`;
        });
        return rtrn;
    }
    opnClsr = new openCloser();
    static internalKey = 'int' + GetUniqueId();
    cssResolver = new CssRuntimeResolver();
    parseStyleSeperator_sub(_args) {
        let _this = this;
        if (_args.data == undefined)
            return "";
        let _params = Object.assign(Object.assign({}, StyleSeperatorOptions), _args);
        _params.callCounter++;
        let _curAssembly = _this.assembly;
        //let _curProject = _this.projectInfo;
        let rtrn = this.cssResolver.resolveImports(_params.data);
        rtrn = this.opnClsr.doTask("{", "}", rtrn, (selectorText, styleContent, count) => {
            let excludeContentList = this.rootAndExcludeHandler.checkRoot(selectorText, styleContent, _params);
            if (excludeContentList.length == 0) {
                let trimSelector = selectorText.trim();
                let m = trimSelector.match(patternList.mediaSelector);
                if (m != null) { //  IF CURRENT IS MEDIA SELECTOR
                    let type = '@' + m[1].trim();
                    switch (type) {
                        case '@media':
                        case '@font-face':
                        case '@supports':
                        case '@container':
                        case '@document':
                            let csnt = _this.parseStyleSeperator_sub(Object.assign({}, _args, { data: styleContent }));
                            return `${trimSelector} { ${csnt} } `;
                        case '@keyframes':
                            let v = m[2].trim().replace(patternList.animationAccessPattern, (ms, scope, name) => {
                                return _this.varHandler.GetCSSAnimationName(scope, name);
                            });
                            return `@keyframes ${v} {${styleContent}} `;
                    }
                }
                else {
                    let sel = '';
                    let extraTextAtBegining = '';
                    selectorText = selectorText.replace(/(.*?)([^;]*?)$/gim, (m, extraText, slctr) => {
                        extraTextAtBegining += " " + extraText;
                        sel += slctr;
                        return '';
                    });
                    sel = sel.trim();
                    const res = _this.selectorHandler.parseScopeSeperator({
                        selectorText: sel,
                        scopeSelectorText: _params.scopeSelectorText,
                        assembly: _curAssembly,
                        //  project: _curProject,
                        isForRoot: _params.isForRoot
                    });
                    let grp = StylerRegs.groupByStyler(res);
                    let finalreturn = '';
                    grp.forEach(s => {
                        styleContent = s.styler.varHandler.handlerVariable(styleContent);
                        finalreturn += ` ${s.selectors.join(',')} {${styleContent}} `;
                    });
                    return `${extraTextAtBegining} ${finalreturn}`;
                }
            }
            else {
                return excludeContentList.join(' ');
            }
        });
        rtrn = _this.varHandler.handlerVariable(rtrn);
        rtrn = this.cssResolver.resolveUrls(rtrn);
        //    console.log(rtrn);
        /// console.log(extraTextAtBegining);
        //rtrn = extraTextAtBegining + '' + rtrn;
        //debugger;
        //rtrn = rtrn.trim().replace(/(;|,|:|{|})[\n\r ]*/gi, "$1");
        return /*STYLE_BLOCK_NODE.join("") + " " +*/ rtrn; //.trim().replace(/(;|,|{|})[\n\r ]*/gi, "$1");
    }
    static groupByStyler(nodes) {
        const map = new Map();
        for (const node of nodes) {
            if (!map.has(node.styler)) {
                map.set(node.styler, []);
            }
            map.get(node.styler).push(node.selector);
        }
        // convert to final array if needed
        return Array.from(map, ([styler, selectors]) => ({
            styler,
            selectors,
        }));
    }
    pushChild(cssGuid, node, accessKey) {
        console.log(cssGuid);
        let sreg = this.children.find((s) => s.cssGuid == cssGuid);
        if (sreg == undefined) {
            node.alices = accessKey.toLowerCase();
            node.cssGuid = cssGuid;
            node.parent = this;
            this.children.push(node);
        }
        node.parent = this;
    }
}
export class RootAndExcludeHandler {
    main;
    constructor(main) {
        this.main = main;
    }
    rootExcludePattern;
    checkRoot(selectorText, styleContent, _params) {
        let changed = false;
        let _this = this;
        let externalStyles = [];
        selectorText.replace(patternList.subUcFatcher, (match, quationMark, cssGuid, UCselector) => {
            let tree = this.main.children.find((s) => s.cssGuid == cssGuid || s.controlXName == cssGuid);
            if (tree != undefined) {
                let nscope = _params.callCounter == 1
                    ? this.main.selectorHandler._DEFAULT_KEYS.MAIN_SELECTOR
                    : _params.scopeSelectorText;
                let css = tree.parseStyleSeperator_sub({
                    data: styleContent,
                    scopeSelectorText: nscope,
                    callCounter: _params.callCounter,
                });
                externalStyles.push(css);
                changed = true;
                return "";
            }
            return "";
        });
        if (changed)
            return externalStyles;
        if (selectorText.match(patternList.rootExcludePattern) == null)
            return [];
        let selectors = selectorText.split(",");
        for (let i = 0; i < selectors.length; i++) {
            const pselctor = selectors[i];
            pselctor.trim().replace(patternList.rootExcludePattern, (match, rootAlices, nmode) => {
                switch (nmode) {
                    case ":root":
                        if (rootAlices == undefined || rootAlices == '') {
                            changed = true;
                            externalStyles.push(_this.main.parseStyleSeperator_sub({
                                data: _params.scopeSelectorText + styleContent,
                                callCounter: _params.callCounter,
                                isForRoot: true,
                                // _rootinfo: undefined
                            }));
                        }
                        else {
                            // let rInfo = ProjectManage.getInfoByAlices(
                            //   rootAlices // `@${rootAlices}:`
                            // );
                            let aInfo = AssemblyManager.GetAssemblyByName(rootAlices);
                            if (aInfo != undefined) {
                                externalStyles.push(_this.main.parseStyleSeperator_sub({
                                    data: _params.scopeSelectorText + styleContent,
                                    callCounter: _params.callCounter,
                                    isForRoot: true,
                                    _assembly: aInfo,
                                    //_projectinfo: rInfo,
                                }));
                            }
                        }
                        break;
                    case ":exclude":
                        externalStyles.push(styleContent);
                        return "";
                }
                return "";
            });
        }
        return externalStyles;
    }
}
// export class ThemeCssHandler {
//   main: StylerRegs;
//   constructor(main: StylerRegs) {
//     this.main = main;
//   }
//   match(rtrn: string): string {
//     let _this = this;
//     let cssfilepath = this.main.main.cssFivlePath;
//     rtrn = rtrn.replace(
//       patternList.themeCSSLoader,
//       (match: string, code: string, quationMark: string, path: string, offset: any, input_string: string) => {
//         /*switch (code) {
//           case "use":*/
//         let themecontents = '';
//         if (cssfilepath != undefined) {
//           const fspath = nodeFn.path.resolveFilePath(cssfilepath, path);
//           themecontents = ucUtil.devEsc(nodeFn.fs.readFileSync(fspath));
//         }
//         themecontents = StylerRegs.REMOVE_COMMENT(themecontents);
//         themecontents = StylerRegs.REMOVE_EXTRASPACE(_this.match(themecontents));
//         return themecontents;
//         /*case "import":
//           console.log('[[[[[[[[[[[[[[[[[[[[     IMPORT     ]]]]]]]]]]]]]]]]]]]]]]');
//           if (cssfilepath != undefined) {
//             const fspath = nodeFn.path.resolveFilePath(cssfilepath, path);
//             let prj = GetDeclaration(this.main.projectInfo.importMetaURL);// ProjectManage.getInfo(fspath, this.main.projectInfo.importMetaURL);
//             let stpSrc = StampNode.registerSoruce({
//               key: path,
//               cssFilePath: fspath,
//               baseType: _this.main.baseType,
//               project: prj.project as any,
//               accessName: '',
//             });
//             stpSrc.pushCSS(fspath, prj.project.importMetaURL);
//             _this.main.main.onRelease.push(async () => {
//               await stpSrc.release();
//             });
//           }
//           return "";
//       }*/
//       }
//     );
//     return rtrn;
//   }
// }
export const ScopeSelectorOptions = {
    selectorText: "",
    scopeSelectorText: "",
    /*project: undefined,*/ assembly: undefined,
    isForRoot: false,
    hiddens: {
        assembly: undefined,
        list: {},
        isForRoot: false,
        counter: 0,
    }
};
export class SelectorHandler {
    main;
    _DEFAULT_KEYS = {
        MAIN_SELECTOR: '',
        MAIN_ROOT_SELECTOR: '',
        SCP: {},
    };
    _selectorMode = '^';
    get selectorMode() {
        return this._selectorMode;
    }
    set selectorMode(value) {
        this._selectorMode = value;
        this.updateSCP(value);
    }
    constructor(main, mode = '^') {
        this.main = main;
        let dkey = this._DEFAULT_KEYS;
        const mainKey = this.main.KEYS;
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            switch (main.baseType) {
                case StyleBaseType.Template:
                    dkey.MAIN_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}="${mainKey.LOCAL}_${mainKey.TEMPLATE}_${mainKey.ROOT}"]`;
                    dkey.MAIN_ROOT_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}$="_${mainKey.ROOT}"]`;
                    break;
                case StyleBaseType.TemplateCommon:
                    dkey.MAIN_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}="${mainKey.LOCAL}_${mainKey.TEMPLATE}_${mainKey.ROOT}"]`;
                    dkey.MAIN_ROOT_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}$="_${mainKey.ROOT}"]`;
                    break;
                case StyleBaseType.UserControl:
                    dkey.MAIN_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}="${mainKey.LOCAL}_${mainKey.ROOT}"]`;
                    dkey.MAIN_ROOT_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}$="_${mainKey.ROOT}"]`;
                    break;
                case StyleBaseType.Global:
                    dkey.MAIN_ROOT_SELECTOR = `${main.nodeName}[${ATTR_OF.UC.ALL}$="_${mainKey.ROOT}"]`;
                    break;
            }
        }
        else {
            dkey.MAIN_SELECTOR = `${main.nodeName}.${ATTR_OF.__CLASS(mainKey.LOCAL, 'm')}.${ATTR_OF.__CLASS(mainKey.ROOT, 'r')}`;
        }
        this.selectorMode = mode;
    }
    updateSCP(mode) {
        let dkey = this._DEFAULT_KEYS;
        const mainKey = this.main.KEYS;
        dkey.SCP.selectorOperation = mode;
        switch (this.selectorMode) {
            case '$':
                dkey.SCP.scope = 'r';
                dkey.SCP.key = `_${mainKey.ROOT}`;
                break;
            case '^':
                dkey.SCP.scope = 'l';
                dkey.SCP.key = `${mainKey.LOCAL}_`;
                break;
            case '*':
                dkey.SCP.scope = 'g';
                dkey.SCP.key = `_${mainKey.TEMPLATE}_`;
                break;
        }
    }
    parseScopeSeperator(scopeOpt) {
        let _this = this;
        const result = [];
        scopeOpt = Object.assign(ScopeSelectorOptions, scopeOpt);
        scopeOpt.hiddens.assembly = scopeOpt.assembly;
        scopeOpt.hiddens.scopeSelectorText = scopeOpt.scopeSelectorText;
        scopeOpt.hiddens.isForRoot = scopeOpt.isForRoot;
        if (scopeOpt.selectorText.trim() == '')
            return result;
        let counter = scopeOpt.hiddens.counter;
        let oc = new openCloser();
        let _selctor = oc.doTask('(', ')', scopeOpt.selectorText, (selector, cssStyle, opened) => {
            if (opened > 1) {
                if (selector.endsWith(':has')) {
                    scopeOpt.selectorText = cssStyle;
                    let key = _this.KEY(scopeOpt.hiddens);
                    cssStyle = _this.parseScopeSeperator(scopeOpt).map(s => s.selector).join(','); //.selector
                    scopeOpt.hiddens.list[key] = { selector: cssStyle, funcName: 'has', value: '(' + cssStyle + ')' };
                    return selector + '' + key;
                }
                else {
                    return selector + '(' + cssStyle + ')';
                }
            }
            if (selector.endsWith(':has')) {
                scopeOpt.selectorText = cssStyle;
                let key = _this.KEY(scopeOpt.hiddens);
                scopeOpt.hiddens.list[key] = { selector: cssStyle, funcName: 'has', value: '(' + cssStyle + ')' };
                return selector + '' + key;
            }
            else {
                return selector + '(' + cssStyle + ')';
            }
        });
        //result.selector =
        //let n = Object.assign({}, scopeOpt);
        scopeOpt.selectorText = _selctor;
        if (counter == 0) {
            Object.assign(result, this.loopMultipleSelectors(_selctor, /*this.main,*/ scopeOpt.hiddens));
            //console.log([oldSelector, rtrn]);
            scopeOpt.hiddens.list = {};
            scopeOpt.hiddens.counter = 0;
        }
        //let sub = this.parseScopeSeperator_sub(scopeOpt);
        // console.log([sub, rtrn]);
        return result;
    }
    loopMultipleSelectors(selector, /*stylers: StylerRegs,*/ hiddens) {
        let selectors = selector.split(',');
        const rtrn = [];
        for (let i = 0, len = selectors.length; i < len; i++) {
            rtrn.push(this.splitselector(selectors[i], /*stylers,*/ hiddens));
        }
        return rtrn; //.join(',');
    }
    KEY(hiddens) {
        hiddens.counter++;
        return '◄◘' + hiddens.counter + '◘▀';
    }
    splitselector(selector, hiddens) {
        let _this = this;
        const rtrn = {
            selector: selector,
            styler: _this.main
        };
        let splitted = selector.split(' ');
        let hasUcFound = false;
        let kvNode;
        let nSelector = '';
        let isStartWithSubUc = false;
        let sub_styler = undefined;
        for (let i = 0, len = splitted.length; i < len; i++) {
            let sel = splitted[i];
            hasUcFound = false;
            sub_styler = undefined;
            let matchs = sel.replace(/^&(\w+)/gm, (match, ucName) => {
                sub_styler = _this.main.children.find(s => s.controlXName === ucName);
                hasUcFound = (sub_styler != undefined);
                if (hasUcFound) {
                    isStartWithSubUc = (i == 0);
                    let nnode = '';
                    nnode = (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) ?
                        `${sub_styler.nodeName}[${ATTR_OF.UC.ALL}="${sub_styler.KEYS.LOCAL}"]`
                        :
                            `${sub_styler.nodeName}.${ATTR_OF.__CLASS(sub_styler.KEYS.LOCAL, 'm')}`;
                    let key = _this.KEY(hiddens);
                    kvNode = key;
                    hiddens.list[kvNode] = { value: nnode };
                    return key;
                }
                else
                    return match;
            });
            if (hasUcFound) {
                splitted[i] = matchs;
                let nextSplitters = splitted.slice(i);
                let subSelector = nextSplitters.join(' ');
                const subRes = sub_styler.selectorHandler.splitselector(subSelector.replace(kvNode, '&'), /*sub_styler,*/ hiddens);
                splitted[i] = subRes.selector;
                rtrn.styler = subRes.styler;
                hasUcFound = false;
                splitted = splitted.slice(0, i + 1);
                break;
            }
            else {
                let ntext = splitted[i];
                ntext = ntext.replace(/◄◘(\d+)◘▀/gm, (r) => {
                    const _loopSel = _this.loopMultipleSelectors(hiddens.list[r].selector, /* styler,*/ hiddens);
                    return '(' + _loopSel.map(s => s.selector).join(',') + ')';
                });
                splitted[i] = ntext;
            }
        }
        if (isStartWithSubUc)
            splitted.unshift('&');
        let styler = this.main;
        let joinedValue = '';
        splitted = splitted.filter(word => {
            joinedValue += word;
            return word !== "";
        });
        let len = splitted.length;
        let fsel = '';
        if (hiddens.isForRoot) {
            fsel = splitted[len - 1];
            if (joinedValue.includes('&')) {
                switch (len) {
                    case 1:
                        splitted[0] = fsel.replace('&', this._DEFAULT_KEYS.MAIN_ROOT_SELECTOR);
                        break;
                    default:
                        for (let i = 0, ilen = splitted.length; i < ilen; i++) {
                            const ispl = splitted[i];
                            if (ispl.includes('&')) {
                                splitted[i] = ispl.replace('&', this._DEFAULT_KEYS.MAIN_ROOT_SELECTOR);
                                break;
                            }
                            else
                                splitted[i] = ispl.replace('&', this._DEFAULT_KEYS.MAIN_ROOT_SELECTOR);
                        }
                        splitted[len - 1] = this.MISC_SELECTOR_CONDITION(fsel, {
                            scope: 'r',
                            selectorOperation: '$',
                            key: '_' + hiddens.assembly.id
                        });
                        break;
                }
            }
            else {
                splitted[len - 1] = this.MISC_SELECTOR_CONDITION(fsel, {
                    scope: 'r',
                    selectorOperation: '$',
                    key: '_' + hiddens.assembly.id
                });
            }
        }
        else {
            fsel = splitted[0];
            if (fsel.startsWith('&')) {
                splitted[0] = fsel.replace('&', this._DEFAULT_KEYS.MAIN_SELECTOR);
            }
            else {
                if (fsel.length == 1)
                    splitted[0] = this.MISC_SELECTOR_CONDITION(fsel, this._DEFAULT_KEYS.SCP);
                else {
                    fsel = splitted[len - 1];
                    splitted[len - 1] = this.MISC_SELECTOR_CONDITION(fsel, this._DEFAULT_KEYS.SCP);
                }
            }
            // switch (len) {
            //   case 1:
            //     if (fsel.startsWith('&'))
            //       splitted[0] = fsel.replace('&', this._DEFAULT_KEYS.MAIN_SELECTOR); //fsel.replace('&', `${main.nodeName}[${ATTR_OF.UC.ALL}="${styler.LOCAL_STAMP_KEY}"]`); //`${main.nodeName}.${ATTR_OF.UC.UC_STAMP+''+styler.uniqStamp}` 
            //     else {
            //       splitted[0] = this.MISC_SELECTOR_CONDITION(fsel, this._DEFAULT_KEYS.SCP); //this.CLASS_SELECTOR_CONDITION(fsel, __VARS.scope, __VARS.key); //ATTR_OF.UC.CLASS_PARENT+''+styler.uniqStamp
            //     }
            //     break;
            //   default:
            //     if (fsel.startsWith('&'))
            //       splitted[0] = fsel.replace('&', this._DEFAULT_KEYS.MAIN_SELECTOR);  // fsel.replace('&', `${main.nodeName}[${ATTR_OF.UC.ALL}="${styler.LOCAL_STAMP_KEY}"]`); //   // `${main.nodeName}.${ATTR_OF.UC.UC_STAMP+''+styler.uniqStamp}`
            //     else {
            //       fsel = splitted[len - 1];
            //       splitted[len - 1] = this.MISC_SELECTOR_CONDITION(fsel, this._DEFAULT_KEYS.SCP); //this.CLASS_SELECTOR_CONDITION(fsel, __VARS.scope, __VARS.key); // ATTR_OF.UC.CLASS_PARENT+''+styler.uniqStamp
            //     }
            //     break;
            // }
        }
        splitted.unshift(hiddens.scopeSelectorText != undefined ? hiddens.scopeSelectorText : '');
        rtrn.selector = splitted.join(' ');
        return rtrn;
    }
    MISC_SELECTOR_CONDITION(selector, xk) {
        let dbl = selector.split(/ *:: */);
        let sngl = dbl[0].split(/ *: */);
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
            sngl[0] += `[${ATTR_OF.UC.ALL}${xk.selectorOperation}="${xk.key}"]`;
        }
        else {
            sngl[0] += `.${ATTR_OF.__CLASS(xk.key, xk.scope)}`;
        }
        dbl[0] = sngl.join(":");
        return dbl.join("::");
    }
}
export class CssVariableHandler {
    static GetCombinedCSSVarName = (key, uniqId, code) => {
        return `--${key}${uniqId}${code}`;
    };
    static GetCombinedCSSAnimationName = (key, uniqId, code) => {
        return `anm${key}${uniqId}${code}`;
    };
    static SetCSSVarValue = (vlst, uniqId, code, tarEle = document.body) => {
        let style = tarEle.style;
        for (const [key, value] of Object.entries(vlst)) {
            style.setProperty(this.GetCombinedCSSVarName(key, uniqId, code), value);
        }
        return;
    };
    static GetCSSVarValue = (key, uniqId, code, defaultVal) => {
        return ` var(${this.GetCombinedCSSVarName(key, uniqId, code)},${defaultVal}) `;
    };
    GetCSSAnimationName = (scope, name) => {
        //scope = r[1] as CSSVariableScopeSort;
        // name = r[2];
        switch (scope) {
            case 'g': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.ROOT, 'g');
            case 't': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.TEMPLATE, 't');
            case 'l': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.LOCAL, 'l');
            case '': return name;
            default: return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.LOCAL, 'l');
        }
        /*
        let r = animName.match(/^-(lgit)-(\w+)/i); // "g" | "l" | "i" | "t"
        let scope: CSSVariableScopeSort = '' as any;
        let name = animName;
        if (r == null) return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.LOCAL, 'l');
        else {
          scope = r[1] as CSSVariableScopeSort;
          name = r[2];
          switch (scope) {
            case 'g': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.ROOT, 'g');
            case 't': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.TEMPLATE, 't');
            case 'l': return CssVariableHandler.GetCombinedCSSAnimationName(name, this.main.KEYS.LOCAL, 'l');
            default: return animName;
          }
        }*/
    };
    main;
    constructor(main) {
        this.main = main;
    }
    handlerVariable(rtrn) {
        let _this = this;
        let _main = this.main;
        rtrn = rtrn.replace(patternList.varHandler, (match, fullVarName, defaultVal) => {
            //console.log([match, fullVarName, defaultVal]);
            defaultVal = defaultVal.trim();
            let ky = fullVarName; //.toLowerCase();
            let scope = ky.charAt(1);
            let varName = ky.substring(3).trim();
            let uniqId = _main.KEYS.INTERNAL; // StylerRegs.internalKey;
            let isPrintWithEmptyValue = defaultVal.length == 0;
            let isPrintWithDefaultValue = defaultVal.endsWith('--');
            let isSettingValue = defaultVal.charAt(0) == ':' && defaultVal.slice(-1) == ';';
            if (isPrintWithEmptyValue || isPrintWithDefaultValue) { // GET VALUE 
                if (isPrintWithDefaultValue) {
                    //console.log(defaultVal);
                    defaultVal = ucUtil.trimText_(defaultVal, '--');
                    //console.log(defaultVal);
                    //console.log("-------------------------");
                    defaultVal = _this.handlerVariable(defaultVal);
                }
                switch (scope) {
                    case "g":
                        uniqId = '' + _main.KEYS.ROOT;
                        break;
                    case "t":
                        uniqId = _main.KEYS.TEMPLATE;
                        break;
                    case "i":
                        uniqId = _main.KEYS.INTERNAL; //StylerRegs.internalKey;
                        break;
                    case "l":
                        uniqId = _main.KEYS.LOCAL;
                        break;
                }
                return CssVariableHandler.GetCSSVarValue(varName, uniqId, scope, defaultVal);
            }
            else if (isSettingValue) { // SET VALUE
                let tarEle = undefined;
                defaultVal = ucUtil.trimText_(ucUtil._trimText(defaultVal, ':'), ';');
                defaultVal = _this.handlerVariable(defaultVal);
                switch (scope) {
                    case "g":
                        uniqId = '' + this.main.KEYS.ROOT;
                        break;
                    case "t":
                        uniqId = _main.KEYS.TEMPLATE;
                        tarEle = _main.wrapperHT;
                        break;
                    case "i":
                        uniqId = _main.KEYS.INTERNAL; //StylerRegs.internalKey;
                        tarEle = _main.wrapperHT;
                        break;
                    case "l":
                        uniqId = _main.KEYS.LOCAL;
                        tarEle = _main.wrapperHT;
                        break;
                    default: return match;
                }
                let key = varName;
                CssVariableHandler.SetCSSVarValue({ [key]: defaultVal }, uniqId, scope, tarEle);
                return '';
            }
            //console.log(scope, varName, defaultVal);
            return match;
        });
        rtrn = rtrn.replace(patternList.animationNamePattern, (match, scope, value) => {
            //_this.varHandler.GetCSSAnimationName(scope,value);
            return `animation-name : ${_this.GetCSSAnimationName(scope, value)}; `;
        });
        return rtrn;
    }
}
class openCloser {
    ignoreList = [];
    parse(oc, str) {
        let result = [];
        let stack = [];
        let buffer = "";
        let level = 0;
        let i = 0;
        while (i < str.length) {
            let ignored = this.ignoreList.find(il => str.startsWith(il.openingChar, i));
            // If inside an ignored block, find closing delimiter
            if (ignored) {
                let ignSearchStartAt = i + ignored.openingChar.length;
                let endIdx = -1;
                do {
                    endIdx = str.indexOf(ignored.closingChar, ignSearchStartAt);
                    if (endIdx == -1)
                        break;
                    else if (str.at(endIdx - 1) == '\\') {
                        ignSearchStartAt = endIdx + 1;
                    }
                    else
                        break;
                } while (true);
                if (endIdx !== -1) {
                    // Skip ignored content entirely
                    buffer += str.substring(i, endIdx + ignored.closingChar.length);
                    i = endIdx + ignored.closingChar.length - 1;
                }
                else {
                    buffer += str.substring(i);
                    break;
                }
            }
            // Handle Opening `{`
            else if (str.startsWith(oc.openingChar, i)) {
                let frontContent = buffer.trim();
                buffer = "";
                let node = { frontContent, betweenContent: "", level, child: [] };
                stack.push({ node, startIndex: i + oc.openingChar.length }); // Track block start index
                level++;
                i += oc.openingChar.length - 1;
            }
            // Handle Closing `}`
            else if (str.startsWith(oc.closingChar, i)) {
                let betweenContent = buffer.trim();
                buffer = "";
                if (stack.length > 0) {
                    let { node, startIndex } = stack.pop();
                    node.betweenContent = str.substring(startIndex, i).trim(); // Full content inside `{}`
                    level--;
                    if (stack.length > 0) {
                        stack[stack.length - 1].node.child.push(node);
                    }
                    else {
                        result.push(node);
                    }
                }
                i += oc.closingChar.length - 1;
            }
            // Normal character
            else {
                buffer += str[i];
            }
            i++;
        }
        //console.log(result);
        return result;
    }
    isEscaped(text, endIndex) {
        let count = 0;
        for (let i = endIndex - 1; i >= 0 && text[i] === "\\"; i--) {
            count++;
        }
        return count % 2 === 1;
    }
    doTask(openTxt, closeTxt, contents, callback = () => "") {
        let opened = 0, closed = 0;
        let rtrn = "";
        let lastoutIndex = 0, lastinIndex = 0;
        let buffer = "";
        let state = "resume";
        let activeIgnore = null;
        const oLEN = openTxt.length;
        const cLEN = closeTxt.length;
        for (let index = 0, len = contents.length; index <= len; index++) {
            let ch = contents.charAt(index);
            buffer += ch;
            // ================= IGNORE MODE =================
            if (state === "pause") {
                if (activeIgnore &&
                    buffer.endsWith(activeIgnore.closingChar)) {
                    let end = buffer.length - 1;
                    // skip escaped closing char like \" \' \`
                    if (!this.isEscaped(buffer, end)) {
                        state = "resume";
                        activeIgnore = null;
                    }
                }
                continue;
            }
            // ================= ENTER IGNORE =================
            for (let ig of this.ignoreList) {
                if (buffer.endsWith(ig.openingChar)) {
                    state = "pause";
                    activeIgnore = ig;
                    break;
                }
            }
            // ================= NORMAL COUNT =================
            if (buffer.endsWith(openTxt)) {
                if (opened === 0)
                    lastinIndex = index;
                opened++;
            }
            else if (buffer.endsWith(closeTxt)) {
                closed++;
            }
            // ================= BLOCK COMPLETE =================
            if (opened === closed && opened > 0) {
                let selector = contents.substring(lastoutIndex, lastinIndex - oLEN + 1);
                let cssStyle = contents.substring(lastinIndex + 1, index - cLEN + 1);
                rtrn += callback(selector, cssStyle, opened);
                lastoutIndex = index + 1;
                opened = closed = 0;
            }
            // ================= END FILE =================
            if (index === len) {
                rtrn += contents.substring(lastoutIndex);
            }
        }
        return rtrn;
    }
}
//# sourceMappingURL=StylerRegs.js.map