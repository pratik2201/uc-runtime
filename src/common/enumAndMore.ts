import { codeFileInfo } from "../global/codeFileInfo.js";
import { SourceNode } from "../lib/StampGenerator.js";
import { IKeyStampNode } from "../renderer/StylerRegs.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
export type UCGenerateMode = "client" | "designer";
export type UcStates = "normal" | "dock" | "minimize" | "maximize";
// ResourceManage.d.ts


export interface ResourceNamedRegistry { }
export type ResourceProjectNamesList = keyof ResourceNamedRegistry;

export type ResourceNamedList = keyof ResourceNamedRegistry;



export interface ResourceKeyRegistry { }
export type ResourceKeyList = keyof ResourceKeyRegistry;




export type BuildResourceType = "css" | "html" | "image" | "text" | "raw" | "data";
export class BuildResource {
  guid: string;
  name?: string;
  type: BuildResourceType;
  content: string;
  source?: string;
}
export class UserResource extends BuildResource {
  /**
   * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
   * THAT CSS AS PROJECT'S GLOBAL CSS
   */
  isGlobalCss? = false;
  project?: ResourceProjectNamesList;
}

export type FileTypes =
  | "cssFile"
  | "htmlFile"
  | "imageFile"
  | "textFile"
  | "rawFile"
  | "string"
  | "integer"
  | "float"
  | "boolean";

export class FileEntry {
  type: FileTypes = 'textFile';
  value = '';
  filePath: string;
}

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
export class ResourceKeyBridge {

  // how placeholders look in text
  static PREFIX = "__RES::";
  static SUFFIX = "__";

  // __RES::sharepnl:css:uuid__
  static PLACEHOLDER_RE = /__RES::([a-zA-Z0-9._:-]+)__/g;

  // ----------------------------
  // make "__RES::key__"
  // ----------------------------
  static makeKey(key: string): string {
    return `${this.PREFIX}${key}${this.SUFFIX}`;
  }

  // ----------------------------
  // extract "sharepnl:css:uuid"
  // ----------------------------
  static extractKey(placeholder: string): string | null {
    if (!placeholder.startsWith(this.PREFIX) || !placeholder.endsWith(this.SUFFIX))
      return null;

    return placeholder.slice(
      this.PREFIX.length,
      placeholder.length - this.SUFFIX.length
    );
  }

  // ----------------------------
  // find all keys inside text
  // ----------------------------
  static findAll(text: string): string[] {
    const out: string[] = [];
    let m: RegExpExecArray | null;

    this.PLACEHOLDER_RE.lastIndex = 0;

    while ((m = this.PLACEHOLDER_RE.exec(text))) {
      out.push(m[1]);
    }
    return out;
  }

  // ----------------------------
  // replace placeholders
  // ----------------------------
  static replace(
    text: string,
    resolver: (key: string) => string
  ): string {
    return text.replace(this.PLACEHOLDER_RE, (_m, key) => {
      return resolver(key);
    });
  }

  // ----------------------------
  // quick check
  // ----------------------------
  static isPlaceholder(value: string): boolean {
    return value.startsWith(this.PREFIX) && value.endsWith(this.SUFFIX);
  }
}
export interface ISourceOptions {
  htmlRow?: any;
  //htmlImportMetaUrl?: string;
  htmlGuid?: string; //ResourceKeyList;
  cssGuid?: string;// ResourceKeyList;
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
  guid?: string;
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


