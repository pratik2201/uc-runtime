import { TemplateMaker } from "ap-shared-core/out/template/TemplateMaker.js";
import { ITemplateNodeMeta } from "ap-shared-core/out/uc-runtime/Template.js";
import { ITptOptions } from "../../core.js";
import { SourceNode } from "../../lib/StampGenerator.js";
import { VariableList, CSSVariableScope } from "../StylerRegs.js";
import { TemplateNode, Template } from "../Template.js";
import { Usercontrol } from "../Usercontrol.js";
import { ITransferDataNode } from "../UsercontrolRes/Usercontrol$Event.js";
export declare class TemplateNode$Extended {
    constructor(tnodeMain: TemplateNode);
    tnode: TemplateNode;
    template: Template;
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
        [key: string]: HTMLElement<any>;
    };
}
