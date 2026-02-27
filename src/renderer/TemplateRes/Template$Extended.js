import { ITemplateContent, splitCSSById } from "ap-shared-core/out/uc-runtime/Template.js";
import { ucUtil } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { AssemblyManager } from "../../core.js";
import { StylerRegs } from "../StylerRegs.js";
export class Template$Extended {
    constructor(main) {
        this.main = main;
    }
    main;
    initializebase = (pera) => {
        StylerRegs.templateID++;
        this.parentUc = pera.parentUc;
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
        this.guid = pera.guid;
        this.assembly = AssemblyManager.Parse(this.guid);
        htmlContent = pera.htmlContent;
        cssContent = pera.cssContent;
        //}
        /* {
            console.warn([`no info for template in `, pera]);
            return;
        }*/
        if (this.resource == undefined && htmlContent != undefined && cssContent != undefined) {
            this.resource = GetTemplateMetaByContent$Renderer(htmlContent, cssContent);
            Object.assign(this.resource, cfgObj);
            this.resource.outerCssContents = this.resource.outerCssContents ?? '';
        }
    };
    takeoff = () => {
        delete this.initializebase;
    };
    guid;
    resource;
    assembly;
    parentUc;
}
export function GetTemplateMetaByContent$Renderer(htmlcontent, cssContent) {
    //let ele = ucUtil.PHP_REMOVE(htmlcontent)["#$"]() as HTMLElement;
    let rtrn = new ITemplateContent();
    let ele = ucUtil.PHP_REMOVE(htmlcontent)["#$"]();
    let hasMultipleNode = !ele.hasAttribute('id');
    if (hasMultipleNode) {
        for (const ichild of Array.from(ele.children)) {
            let id = ichild.getAttribute('id');
            if (id != null) {
                rtrn.templates[id] = {
                    htmlContents: ucUtil.PHP_ADD(ichild.outerHTML),
                };
            }
        }
    }
    else {
        let id = ele.getAttribute('id');
        rtrn.templates[id] = {
            // accessKey: id,
            // objectKey: undefined,
            htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
        };
    }
    let rtrnKeys = Object.keys(rtrn.templates);
    let isSimpleMode = false;
    if (rtrnKeys.length == 0) {
        rtrn.templates["primary"] = {
            //accessKey: "primary",
            //objectKey: undefined,
            htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
        };
        rtrnKeys = ["primary"];
        isSimpleMode = true;
    }
    splitCSSById(cssContent, rtrn);
    return rtrn;
}
//# sourceMappingURL=Template$Extended.js.map