import { ISourceOptions, ITptOptions } from "../common/enumAndMore.js";
import { TemplateMaker } from "ap-shared-core/out/template/TemplateMaker.js";
import { SourceNode } from "../lib/StampGenerator.js";
import { CSSSearchAttributeCondition, CSSVariableScope, StyleBaseType, VariableList } from "./StylerRegs.js";
import { Usercontrol } from "./Usercontrol.js";
import { Assembly } from "./Assembly.js";
import { ResourceKeyRegistry, ResourceKeyList } from "../core-main.js";
import { ITransferDataNode } from "./UsercontrolRes/Usercontrol$Event.js";
import { ITemplateMeta, ITemplateNodeMeta } from "ap-shared-core/out/uc-control/Template.js";
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
    static GetObjectOfTemplate(guid: keyof ResourceKeyRegistry): ITemplateMeta;
    createTemplate(tptPathOpt: ITemplateNodeMeta): TemplateNode;
    pushTemplateCss(cssCode: string, cssGuid: ResourceKeyList, baseType?: StyleBaseType, mode?: CSSSearchAttributeCondition): void;
    extended: {
        initializebase: (pera: ITptOptions) => void;
        takeoff: () => void;
        guid: ResourceKeyList;
        resource: ITemplateMeta;
        assembly: Assembly;
        parentUc: Usercontrol;
    };
}
export declare class TemplateNode {
    constructor(main: Template);
    extended: {
        main: Template;
        srcNode: SourceNode;
        accessName: string;
        parentUc: Usercontrol;
        setCssVariable: (varList: VariableList, scope: CSSVariableScope) => void;
        getCssVariable: (key: string, scope: CSSVariableScope) => string;
        generateContent: (jsonRow: {}, preDefinedContent?: string) => string;
        tmaker: TemplateMaker;
        generateNode: (jsonRow: any) => HTMLElement;
        initializecomponent: (_args: ITptOptions, tptPathOpt: ITemplateNodeMeta) => void;
        takeoff: () => void;
        sampleNode: HTMLElement;
        Events: {
            beforeGenerateContent: (content: string, jsonRow: any) => string;
            onGenerateContent: (content: string, jsonRow: any) => string;
            onGenerateNode: (mainNode: HTMLElement, jsonRow: any, ctrls?: {
                [key: string]: HTMLElement | HTMLElement[];
            }) => void;
            onDataExport: (data: ITransferDataNode) => boolean;
            onDataImport: (data: ITransferDataNode) => boolean;
        };
        destruct: () => void;
        find: (skey: string, fromHT: HTMLElement) => Element[];
        getAllControls: (specific: string[], fromHT: HTMLElement) => {
            [key: string]: HTMLElement;
        };
    };
}
