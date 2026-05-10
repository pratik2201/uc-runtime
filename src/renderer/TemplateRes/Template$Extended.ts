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
        this.guid = pera.guid;
        this.assembly = AssemblyManager.Parse(this.guid);

        if (this.resource == undefined && pera.htmlContent != undefined && pera.cssContent != undefined) {
            this.resource = GetTemplateMetaByContent$Renderer(pera.htmlContent, pera.cssContent);
            this.resource.outerCssContents = this.resource.outerCssContents ?? '';
            if (this.resource.outerCssContents.trim() != '')
                this.main.AddOuterCSS(this.resource.outerCssContents, this.guid as any);
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
    // let hasMultipleNode = !ele.hasAttribute('id');
    // if (hasMultipleNode) {
    for (const ichild of Array.from(ele.children)) {
        let id = ichild.getAttribute('id');
        if (id != null) {
            bluePrint.templates[id] = {
                htmlContents: ucUtil.PHP_ADD(ichild.outerHTML),
            };
        }
    }
    // } else {
    //     let id = ele.getAttribute('id');
    //     bluePrint.templates[id] = { 
    //         htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
    //     };
    // }
    // let rtrnKeys = Object.keys(bluePrint.templates);
    // let isSimpleMode = false;
    // if (rtrnKeys.length == 0) {
    //     console.log('X  X  X  X  X  X  X  X  XXXXXX   X  X  X  X  X  X  X  X  X');

    //     bluePrint.templates["PRIMARY_TEMPLATE"] = { 
    //         htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
    //     };
    //     rtrnKeys = ["PRIMARY_TEMPLATE"];
    //     isSimpleMode = true;
    // }
}
export function GetTemplateMetaByContent$Renderer(htmlcontent: string, cssContent: string) {
    let rtrn = new ITemplateContent();
    extractHtml(htmlcontent, rtrn);
    const cssResolver = new CssRuntimeResolver();
    cssContent = cssResolver.resolveImports(cssContent);
    splitCSSById(cssContent, rtrn);
    return rtrn;
}
