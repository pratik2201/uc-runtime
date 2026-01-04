import { codeFileInfo } from "./build/codeFileInfo.js";
import { regsManage } from "./build/regs/regsManage.js";
import { TemplateMaker } from "./build/regs/TemplateMaker.js";
import { ITemplatePathOptions, ITptOptions } from "./enumAndMore.js";
import { SourceNode } from "./lib/StampGenerator.js";
import { StyleBaseType, CSSSearchAttributeCondition, VariableList, CSSVariableScope } from "./StylerRegs.js";
import { Usercontrol, ITransferDataNode } from "./Usercontrol.js";
export declare class Template {
    static extractArgs: (args: any) => IArguments;
    static getTemplateOptionByElement(iele: HTMLElement, cinfo: codeFileInfo): ITemplatePathOptions | undefined;
    static splitCSSById(cssContent: string, cssFilePath: string, importMetaUrl: string, rtrn: {
        [key: string]: ITemplatePathOptions;
    }): string;
    static GetOptionsByContent(htmlcontent: string, cssContent: string, cssFilePath: string, importMetaUrl: string): {
        outerCSS: string;
        tptObj: {
            [key: string]: ITemplatePathOptions;
        };
    };
    private static GetTemplatePathOptionsObject;
    static GetObjectOfTemplate(cinfo: codeFileInfo): {
        outerCSS: string;
        tptObj: {
            [key: string]: ITemplatePathOptions;
        };
    };
    static GetArrayOfTemplate(cinfo: codeFileInfo): ITemplatePathOptions[];
    createTemplate(tptPathOpt: ITemplatePathOptions): TemplateNode;
    pushTemplateCss(cssCode: string, cssPath: string, baseType?: StyleBaseType, mode?: CSSSearchAttributeCondition): void;
    extended: {
        initializebase: (pera: ITptOptions) => void;
        cfInfo: codeFileInfo;
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
        regsMng: regsManage;
        setCssVariable: (varList: VariableList, scope: CSSVariableScope) => void;
        getCssVariable: (key: string, scope: CSSVariableScope) => string;
        generateContent: (jsonRow: {}, preDefinedContent?: string) => string;
        tmaker: TemplateMaker;
        generateNode: (jsonRow: any) => HTMLElement;
        initializecomponent: (_args: ITptOptions, tptPathOpt: ITemplatePathOptions) => void;
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
