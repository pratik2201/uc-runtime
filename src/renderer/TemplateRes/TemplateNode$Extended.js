import { TemplateMaker } from "ap-shared-core/out/template/TemplateMaker.js";
import { ATTR_OF } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { ITptOptions } from "../../core.js";
import { SourceNode, FilterContent, STYLER_SELECTOR_TYPE } from "../../lib/StampGenerator.js";
import { CssVariableHandler, StyleBaseType } from "../StylerRegs.js";
export class TemplateNode$Extended {
    constructor(tnodeMain) {
        this.tnode = tnodeMain;
    }
    tnode;
    template;
    srcNode;
    accessName;
    parentUc;
    setCssVariable = (varList, scope) => {
        let styler = this.srcNode.styler;
        switch (scope) {
            case 'global':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.ROOT, "g");
                break;
            case 'template':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.TEMPLATE, "t", this.parentUc.ucExtends.self);
                break;
            case 'local':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.LOCAL, "l", this.parentUc.ucExtends.self);
                break;
            case 'internal':
                CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.INTERNAL, "i", this.parentUc.ucExtends.self);
                break; // StylerRegs.internalKey
        }
    };
    getCssVariable = (key, scope) => {
        let styler = this.srcNode.styler;
        switch (scope) {
            case 'global': return document.body.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.ROOT, "g"));
            case 'template': return this.parentUc.ucExtends.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.TEMPLATE, "t"));
            case 'local': return this.parentUc.ucExtends.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.LOCAL, "l"));
            case 'internal': return this.parentUc.ucExtends.self.style.getPropertyValue(CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.INTERNAL, "i")); // StylerRegs.internalKey
            default: return '';
        }
    };
    generateContent = (jsonRow, preDefinedContent) => {
        let _this = this;
        let dta = preDefinedContent ?? _this.srcNode.htmlCode.content;
        dta = _this.Events.beforeGenerateContent(dta, jsonRow);
        dta = _this.tmaker.compileTemplate(dta)(jsonRow);
        dta = _this.Events.onGenerateContent(dta, jsonRow);
        return dta;
    };
    tmaker = new TemplateMaker();
    generateNode = (jsonRow) => {
        let _ext = this;
        let dta = _ext.generateContent(jsonRow);
        let element = dta["#$"]();
        // TemplateNode.virtualDoc.body.append(element);
        //console.log(_this.stampRow);
        let ctrls = _ext.srcNode.passElement(element, { skipTopEle: false, groupKey: _ext.srcNode.styler.KEYS.TEMPLATE });
        _ext.Events.onGenerateNode(element, jsonRow, ctrls);
        return element;
    };
    initializecomponent = (_args, tptPathOpt) => {
        let tptExt = this;
        const mainExt = tptExt.template.extended;
        let param0 = Object.assign(new ITptOptions(), _args);
        tptExt.accessName = tptPathOpt.accessKey;
        tptExt.srcNode = SourceNode.registerSource({
            key: tptPathOpt.objectKey,
            accessName: tptExt.accessName,
            baseType: StyleBaseType.Template,
            assembly: mainExt.assembly,
            mode: '^',
            //project: param0.cfInfo.projectInfo,
            generateStamp: false
        });
        let isAlreadyExist = tptExt.srcNode.htmlCode.load(tptPathOpt.htmlContents);
        if (!isAlreadyExist)
            tptExt.srcNode.loadHTML(false);
        let htEle = tptExt.srcNode.dataHT;
        Array.from(tptExt.srcNode.dataHT.attributes)
            .filter((s) => s.nodeName.toLowerCase().startsWith("x.temp-"))
            .forEach((s) => htEle.removeAttribute(s.nodeName));
        tptExt.parentUc = mainExt.parentUc;
        let puc = tptExt.parentUc;
        let pext = puc.ucExtends;
        tptExt.srcNode.config({
            parentUc: puc,
            parentSrc: pext.srcNode,
            wrapper: pext.wrapperHT,
            key: `${mainExt.guid}@${tptPathOpt.accessKey}`,
            accessName: tptPathOpt.accessKey
        });
        tptExt.srcNode.pushCSSByContent(mainExt.guid /*undefined*/, tptPathOpt.cssContents, tptExt.parentUc.ucExtends.self);
        tptExt.parentUc.ucExtends.Events.afterClose.on(({}) => {
            tptExt.srcNode.release();
        });
        tptExt.Events.onDataExport = (data) => param0.parentUc.ucExtends.Events.onDataExport(data);
    };
    takeoff = () => {
        delete this.initializecomponent;
    };
    sampleNode;
    Events = {
        //onGettingContent: (jsonRow: any) => { return this.stampRow.content; },
        beforeGenerateContent: (content, jsonRow) => content,
        onGenerateContent: (content, jsonRow) => content,
        onGenerateNode: (mainNode, jsonRow, ctrls) => { },
        onDataExport: (data) => {
            return false;
        },
        onDataImport: (data) => {
            return false;
        },
    };
    destruct = () => {
        this.srcNode.release();
    };
    find = (skey, fromHT) => {
        let exp = /(["=> \w\[\]-^|#~$*.+]*)(::|:)([-\w\(\)]+)/g;
        let ar = skey.split(",");
        let ext = this;
        let q = "";
        let uniqStamp = ext.srcNode.localStamp;
        ar = ar.map((s) => {
            s = FilterContent.select_inline_filter(s, uniqStamp);
            return s;
        });
        return Array.from(fromHT.querySelectorAll(ar.join(",")));
    };
    getAllControls = (specific, fromHT) => {
        if (fromHT == undefined)
            return;
        let childs = {};
        let fromElement = fromHT;
        if (specific != undefined) {
            let uniqStamp = this.srcNode.localStamp;
            specific.forEach((itmpath) => {
                if (!(itmpath in childs)) {
                    let ele;
                    if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
                        ele = fromElement.querySelector(`[${ATTR_OF.X_NAME}='${itmpath}'][${ATTR_OF.UC.ALL}^='${uniqStamp}_']` // old one  `[${propOpt.ATTR.ACCESS_KEY}='${itmpath}'][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                        );
                    }
                    else {
                        ele = fromElement.querySelector(`[${ATTR_OF.X_NAME}='${itmpath}'].${ATTR_OF.__CLASS(uniqStamp, 'l')}` // old one  `[${propOpt.ATTR.ACCESS_KEY}='${itmpath}'][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                        );
                    }
                    fillObj(itmpath, ele);
                }
            });
        }
        else {
            let uniqStamp = this.srcNode.localStamp;
            let eleAr = [];
            if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
                eleAr = Array.from(fromElement.querySelectorAll(`[${ATTR_OF.X_NAME}][${ATTR_OF.UC.ALL}^='${uniqStamp}_']` // old one  `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                ));
            }
            else {
                eleAr = Array.from(fromElement.querySelectorAll(`.${ATTR_OF.__CLASS(uniqStamp, 'l')}[${ATTR_OF.X_NAME}]` // old one  `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
                ));
            }
            eleAr.forEach((ele) => {
                fillObj(ele.getAttribute(ATTR_OF.X_NAME), ele);
            });
        }
        function fillObj(itmpath, htEle) {
            if (htEle != undefined)
                childs[itmpath] = htEle;
            else
                console.warn("empty-controls-returned");
        }
        return childs;
    };
}
//# sourceMappingURL=TemplateNode$Extended.js.map