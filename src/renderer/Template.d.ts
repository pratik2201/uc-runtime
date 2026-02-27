import { ITemplateContent, ITemplateNodeMeta } from "ap-shared-core/out/uc-runtime/Template.js";
import { ISourceOptions } from "../common/enumAndMore.js";
import { ResourceKeyList, ResourceKeyRegistry } from "../core-main.js";
import { CSSSearchAttributeCondition, StyleBaseType } from "./StylerRegs.js";
import { Template$Extended } from "./TemplateRes/Template$Extended.js";
import { TemplateNode$Extended } from "./TemplateRes/TemplateNode$Extended.js";
export declare class Template {
    static MATERIAL: ISourceOptions;
    static extractArgs: (args: any) => IArguments;
    /**
     * !!!! THIS METHOD USED IN DESIGNER FILES
     * @param cinfo
     * @param htContent
     * @param cssdata
     * @returns
     */
    static GetObjectOfTemplate(guid: keyof ResourceKeyRegistry): ITemplateContent;
    createTemplate(tptPathOpt: ITemplateNodeMeta): TemplateNode;
    pushTemplateCss(cssCode: string, cssGuid: ResourceKeyList, baseType?: StyleBaseType, mode?: CSSSearchAttributeCondition): void;
    constructor();
    extended: Template$Extended;
}
export declare class TemplateNode {
    constructor(main: Template);
    extended: TemplateNode$Extended;
}
