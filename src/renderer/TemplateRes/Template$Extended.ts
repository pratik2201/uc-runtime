import { ICoupleNode, ITemplateContent, splitCSSById, ucUtil } from "ap-shared-core/core.js";
import { AssemblyManager, ITptOptions, Template } from "../../core.js";
import { StylerRegs } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { Assembly } from "../Assembly.js";
import { ResourceKeyList } from "ap-shared-core/core-common.js";
import { CssRuntimeResolver } from "../CssRuntimeResolver.js";

export class Template$Extended {
    constructor(main: Template) {
        this.main = main;

    }
    main: Template;
    initializebase = (pera: ITptOptions) => {
        StylerRegs.templateID++;
        this.parentUc = pera.parentUc;
        let htmlContent: string = undefined;
        let cssContent: string = undefined;
        let cfgObj: ICoupleNode = {};
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
    }
    takeoff = () => {
        delete this.initializebase;
    }
    guid: ResourceKeyList;
    resource: ITemplateContent;
    assembly: Assembly;
    parentUc: Usercontrol;
}
function extractHtml(htmlcontent: string, bluePrint: ITemplateContent) {
    bluePrint = bluePrint ?? new ITemplateContent();
    let ele = ucUtil.PHP_REMOVE(htmlcontent)["#$"]();
    let hasMultipleNode = !ele.hasAttribute('id');
    if (hasMultipleNode) {
        for (const ichild of Array.from(ele.children)) {
            let id = ichild.getAttribute('id');
            if (id != null) {
                bluePrint.templates[id] = {
                    htmlContents: ucUtil.PHP_ADD(ichild.outerHTML),
                };
            }
        }
    } else {
        let id = ele.getAttribute('id');
        bluePrint.templates[id] = {
            // accessKey: id,
            // objectKey: undefined,
            htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
        };
    }
    let rtrnKeys = Object.keys(bluePrint.templates);
    let isSimpleMode = false;
    if (rtrnKeys.length == 0) {
        bluePrint.templates["primary"] = {
            //accessKey: "primary",
            //objectKey: undefined,
            htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
        };
        rtrnKeys = ["primary"];
        isSimpleMode = true;
    }
}
export function GetTemplateMetaByContent$Renderer(htmlcontent: string, cssContent: string) {
    //let ele = ucUtil.PHP_REMOVE(htmlcontent)["#$"]() as HTMLElement;
    let rtrn = new ITemplateContent();
    extractHtml(htmlcontent, rtrn);
    const cssResolver = new CssRuntimeResolver();
    cssContent = cssResolver.resolveImports(cssContent);
    splitCSSById(cssContent, rtrn);
    return rtrn;
}
