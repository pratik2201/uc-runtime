import { ITemplateContent } from "ap-shared-core/out/uc-runtime/Template.js";
import { Assembly, ResourceKeyList } from "uc-runtime/src/core-main";
import { ITptOptions, Template } from "../../core.js";
import { Usercontrol } from "../Usercontrol.js";
export declare class Template$Extended {
    constructor(main: Template);
    main: Template;
    initializebase: (pera: ITptOptions) => void;
    takeoff: () => void;
    guid: ResourceKeyList;
    resource: ITemplateContent;
    assembly: Assembly;
    parentUc: Usercontrol;
}
export declare function GetTemplateMetaByContent$Renderer(htmlcontent: string, cssContent: string): ITemplateContent;
