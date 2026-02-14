import { normalizeJSON } from "ap-shared-core/out/objectUtil.js";
import { ITemplateMeta } from "ap-shared-core/out/uc-control/Template.js"; 
import { AssemblyManager, ITptOptions, Template } from "../../core.js";
import { ResourceManage } from "../ResourceManage.js";
import { StylerRegs } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { ResourceKeyList, Assembly } from "uc-control/src/core-main";

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
        const cfg = ResourceManage.getContent(this.guid);
        const cfgObj = normalizeJSON(cfg);
        this.resource = new ITemplateMeta();
        Object.assign(this.resource, cfgObj);
        this.resource.outerCssContents = this.resource.outerCssContents ?? '';
    }
    takeoff = () => {
        delete this.initializebase;
    }
    guid: ResourceKeyList;
    resource: ITemplateMeta;
    assembly: Assembly;
    parentUc: Usercontrol;
}