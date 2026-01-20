import { codeFileInfo } from "../global/codeFileInfo.js";
import { SourceNode } from "../lib/StampGenerator.js";
import { IKeyStampNode } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";

export const getC = (c: any): string | undefined => {
  if (c === undefined || c === null || isNaN(c)) return "";
  return Object.getPrototypeOf(c).constructor.name;
};
export class objectOpt {
  /**
   * this will read `package.json` file from project's root directory and return project name
   * @param dirpath pass project's root directory path
   * @returns
   */
  static getProjectname(dirpath: string): string | undefined {
    let fpath: string = `${dirpath}/package.json`;
    let pjson = require(fpath);
    if (pjson != undefined) {
      return pjson.name;
    }
    return undefined;
  };

  static copyProps<T = Object>(from: T, to: T): T {
    // if (to == undefined) to = {} as T;
    let rtrn = this.clone(to);
    this.recursiveProp(from, rtrn);
    return rtrn;
  }
  static recursiveProp(from: Object, to: Object): void {
    try {
      for (const key in from) {
        if (Object.hasOwnProperty.call(from, key)) {
          const element = from[key];
          if (getC(element) == "Object") {
            let sobj = to[key];
            if (sobj != undefined) this.recursiveProp(element, sobj);
            else to[key] = element;
          } else {
            to[key] = element;
          }
        }
      }
    } catch (ex) {
      if (from === undefined) to = from;
      return;
    }
  }
  static clone<T>(obj: T): T {
    /*let cloned = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    console.log(obj);
    console.log(cloned);
    return cloned;*/
    return JSON.parse(JSON.stringify(obj));
  }
  static copyAttr(from: HTMLElement, to: HTMLElement): void {
    Array.from(from.attributes).forEach(s => to.setAttribute(s.name, s.value)
    );
  }
  static getClassName(obj: object): string {
    return Object.getPrototypeOf(obj).constructor.name;
  }
  static analysisObject(obj: object): { key: string; value: object; type: string; }[] {
    let rtrn: { key: string; value: object; type: string; }[] = [];
    let npro: any;
    do {
      for (const key in Object.getOwnPropertyDescriptors(obj)) {
        let val = undefined;
        try { val = obj[key]; } catch (excp) { }
        let type = val != undefined ? this.getClassName(obj[key]) : "undefined";
        rtrn.push({
          key: key,
          type: type,
          value: val
        });
      }
      obj = Object.getPrototypeOf(obj);
      npro = Object.getPrototypeOf(obj);
    } while ((npro != null || npro != undefined));

    return rtrn;
  }
}

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
   //htmlImportMetaUrl?: string;
    htmlContents?: string;
    cssContents?: string;
    cssFilePath?: string;
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
    source?: ISourceOptions;
    cssBaseFilePath?: string;
    parentUc?: Usercontrol;
}
export const TptOptions: ITptOptions = {
    MakeEmptyTemplate: false,
};
//namespace ucbuilder.global.objectOptions {


