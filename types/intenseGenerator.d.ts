import { IUcOptions, ITptOptions } from "./enumAndMore.js";
import { VariableList } from "./StylerRegs.js";
import { Template } from "./Template.js";
import { Usercontrol } from "./Usercontrol.js";
export declare class intenseGenerator {
    static setCSS_globalVar(varList: VariableList, _path: string): void;
    static generateUC<T = string>(path: T, classObj: any, importMetaURL: string, pera: IUcOptions, ...args: any[]): Usercontrol;
    static generateUCAsync<T = string>(path: T, classObj: any, importMetaURL: string, pera: IUcOptions, ...args: any[]): Promise<Usercontrol>;
    static generateTPT(path: string, classObj: any, callerMetaUrl: string, pera: ITptOptions, ...args: any[]): Template;
    static generateTPTAsync(path: string, classObj: any, callerMetaUrl: string, pera: ITptOptions, ...args: any[]): Promise<any>;
}
