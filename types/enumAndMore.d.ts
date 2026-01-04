import { codeFileInfo } from "./build/codeFileInfo.js";
import { IKeyStampNode } from "./StylerRegs.js";
import { Usercontrol } from "./Usercontrol.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";
export interface SessionOptions {
    addNodeToParentSession?: boolean;
    loadBySession?: boolean;
    uniqueIdentity?: string;
}
export declare const sessionOptions: SessionOptions;
export type WrapperNodeNameAs = "wrapper" | "targetElement" | "random";
export type StringExchangerCallback = (content: string) => string;
export interface ISourceOptions {
    htmlRow?: any;
    htmlImportMetaUrl?: string;
    htmlContents?: string;
    cssContents?: string;
    cssBaseFilePath?: string;
    htmlFilePath?: string;
}
export declare const SourceOptions: ISourceOptions;
export interface ITemplatePathOptions {
    accessKey: string;
    objectKey: string;
    htmlContents?: string;
    cssContents?: string;
    tptCSSContents?: string;
}
export declare const TemplatePathOptions: ITemplatePathOptions;
export type WhatToDoWithTargetElement = "replace" | "append";
export interface IUcOptions {
    cfInfo?: codeFileInfo;
    cssKeyStamp?: IKeyStampNode;
    mode?: UCGenerateMode;
    source?: ISourceOptions;
    parentUc?: Usercontrol;
    accessName?: string;
    context?: any;
    events?: {
        beforeFinalize?: (uc: Usercontrol) => void;
        beforeInitlize?: (uc: Usercontrol) => void;
        afterInitlize?: (uc: Usercontrol) => void;
    };
    dialogUnder?: Usercontrol;
    targetElement?: HTMLElement;
}
export declare const UcOptions: IUcOptions;
export declare function ExtractArguments(args: IArguments): IArguments;
export interface ITptOptions {
    cfInfo?: codeFileInfo;
    MakeEmptyTemplate?: boolean;
    cssBaseFilePath?: string;
    parentUc?: Usercontrol;
}
export declare const TptOptions: ITptOptions;
