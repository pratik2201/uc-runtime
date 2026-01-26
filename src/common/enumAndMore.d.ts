import { codeFileInfo } from "../global/codeFileInfo.js";
import { IKeyStampNode } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";
export declare const getC: (c: any) => string | undefined;
export declare class objectOpt {
    /**
     * this will read `package.json` file from project's root directory and return project name
     * @param dirpath pass project's root directory path
     * @returns
     */
    static getProjectname(dirpath: string): string | undefined;
    static copyProps<T = Object>(from: T, to: T): T;
    static recursiveProp(from: Object, to: Object): void;
    static clone<T>(obj: T): T;
    static copyAttr(from: HTMLElement, to: HTMLElement): void;
    static getClassName(obj: object): string;
    static analysisObject(obj: object): {
        key: string;
        value: object;
        type: string;
    }[];
}
export type WrapperNodeNameAs = "wrapper" | "targetElement" | "random";
export type StringExchangerCallback = (content: string) => string;
export interface ISourceOptions {
    htmlRow?: any;
    htmlContents?: string;
    cssContents?: string;
    cssFilePath?: string;
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
    guid?: string;
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
    source?: ISourceOptions;
    cssBaseFilePath?: string;
    parentUc?: Usercontrol;
}
export declare const TptOptions: ITptOptions;
