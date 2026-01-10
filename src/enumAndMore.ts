import { codeFileInfo } from "./build/codeFileInfo.js";
import { objectOpt } from "./global/objectOpt.js";
import { SourceNode } from "./lib/StampGenerator.js";
import { IKeyStampNode } from "./StylerRegs.js";
import { Usercontrol } from "./Usercontrol.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";



// export interface SessionOptions {
//     addNodeToParentSession?: boolean;
//     loadBySession?: boolean;
//     uniqueIdentity?: string;
// }
// export const sessionOptions: SessionOptions = {
//     addNodeToParentSession: false,
//     loadBySession: false,
//     uniqueIdentity: "",
// };


export type WrapperNodeNameAs = "wrapper" | "targetElement" | "random";
export type StringExchangerCallback = (content: string) => string;
export interface ISourceOptions {
    htmlRow?: any;
    htmlImportMetaUrl?: string;
    htmlContents?: string;
    cssContents?: string;
    cssBaseFilePath?: string;
    htmlFilePath?: string;
    //beforeContentAssign: StringExchangerCallback;
}
export const SourceOptions: ISourceOptions = {
    /*beforeContentAssign: (content) => {
        return content;
    },*/
};

export interface ITemplatePathOptions {
    accessKey: string;
    objectKey: string;
    htmlContents?: string;
    cssContents?: string;
    tptCSSContents?: string;
}
export const TemplatePathOptions: ITemplatePathOptions = {
    accessKey: "",
    objectKey: "",
    htmlContents: "",
    cssContents: "",
};
export type WhatToDoWithTargetElement = "replace" | "append";

export interface IUcOptions {
    cfInfo?: codeFileInfo;
    cssKeyStamp?: IKeyStampNode,
    mode?: UCGenerateMode;
    // session?: SessionOptions;
    source?: ISourceOptions;
    parentUc?: Usercontrol;
    accessName?: string,
    context?: any,
    events?: {
        beforeFinalize?: (uc: Usercontrol) => void;
        beforeInitlize?: (uc: Usercontrol) => void;
        afterInitlize?: (uc: Usercontrol) => void;
    };
    dialogUnder?: Usercontrol,
    //decisionForTargerElement?: WhatToDoWithTargetElement;
    targetElement?: HTMLElement;
}
export const UcOptions: IUcOptions = {
    mode: 'client',
    accessName: '',
    //session: newObjectOpt.clone<SessionOptions>(sessionOptions),
    source: objectOpt.clone<ISourceOptions>(SourceOptions),
    //loadAt: document.body,
    // decisionForTargerElement: 'append',  // waitForDecision
    events: {
        beforeInitlize: async (uc) => {

        },
        afterInitlize: async (uc) => {

        }
    },
};

export function ExtractArguments(args: IArguments): IArguments {
    let cargs = args[0];
    if (cargs.toString() === '[object Arguments]') {
        return ExtractArguments(cargs);
    } else return args;
}

export interface ITptOptions {
    cfInfo?: codeFileInfo;
    MakeEmptyTemplate?: boolean;
    cssBaseFilePath?: string;
    parentUc?: Usercontrol;
}
export const TptOptions: ITptOptions = {
    MakeEmptyTemplate: false,
};