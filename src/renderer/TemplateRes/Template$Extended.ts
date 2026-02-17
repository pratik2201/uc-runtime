import { normalizeJSON } from "ap-shared-core/out/objectUtil.js";
import { ITemplateContent, ICoupleNode, splitCSSById } from "ap-shared-core/out/uc-control/Template.js";
import { AssemblyManager, ITptOptions, Template } from "../../core.js";
import { ResourceManage } from "../ResourceManage.js";
import { StylerRegs } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { ResourceKeyList, Assembly } from "uc-control/src/core-main";
import { ucUtil } from "ap-shared-core/out/uc-control/ucUtil.js";

export class Template$Extended {
    constructor(main: Template) {
        this.main = main;
    }
    main: Template;
    initializebase = (pera: ITptOptions) => {
        StylerRegs.templateID++;
        this.parentUc = pera.parentUc;
        let cfgObj: ICoupleNode;
        if (pera.guid != undefined) {
            this.guid = pera.guid;
            this.assembly = AssemblyManager.Parse(this.guid);
            const cfg = ResourceManage.getContent(this.guid);
            cfgObj = normalizeJSON(cfg);
        } else if (pera.htmlGuid != undefined && pera.cssGuid != undefined) {
            cfgObj.cssGuid = pera.cssGuid;
            cfgObj.htmlGuid = pera.htmlGuid;
        }
        const htmlContent = ResourceManage.getContent(cfgObj.htmlGuid as any);
        const cssContent = ResourceManage.getContent(cfgObj.cssGuid as any);
        this.resource = GetTemplateMetaByContent$Renderer(htmlContent, cssContent);
        Object.assign(this.resource, cfgObj);
        this.resource.outerCssContents = this.resource.outerCssContents ?? '';
    }
    takeoff = () => {
        delete this.initializebase;
    }
    guid: ResourceKeyList;
    resource: ITemplateContent;
    assembly: Assembly;
    parentUc: Usercontrol;
}
export function GetTemplateMetaByContent$Renderer(htmlcontent: string, cssContent: string) {
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
    } else {
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
