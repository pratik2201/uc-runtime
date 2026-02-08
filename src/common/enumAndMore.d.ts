import { ITemplateMeta, IUsercontrolMeta } from "ap-shared-core/out/ucbuilder/Template.js";
import { IKeyStampNode } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
import { ResourceKeyRegistry, ResourceKeyList } from "./resources/enums.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";
export type FileTypes = "cssFile" | "htmlFile" | "imageFile" | "textFile" | "rawFile" | "string" | "integer" | "float" | "boolean";
export declare class FileEntry {
    type: FileTypes;
    value: string;
    filePath: string;
}
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
    htmlGuid?: keyof ResourceKeyRegistry;
    cssGuid?: keyof ResourceKeyRegistry;
}
export declare const SourceOptions: ISourceOptions;
export type WhatToDoWithTargetElement = "replace" | "append";
export interface IUcOptions {
    cssKeyStamp?: IKeyStampNode;
    guid?: ResourceKeyList;
    mode?: UCGenerateMode;
    source?: IUsercontrolMeta;
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
    MakeEmptyTemplate?: boolean;
    guid?: ResourceKeyList;
    source?: ITemplateMeta;
    parentUc?: Usercontrol;
}
export declare const TptOptions: ITptOptions;
