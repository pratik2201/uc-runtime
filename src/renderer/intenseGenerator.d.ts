import { ITptOptions, IUcOptions } from "../common/enumAndMore.js";
import { Template } from "./Template.js";
import { Usercontrol } from "./Usercontrol.js";
export declare class intenseGenerator {
    static generateUC<T = string>(/*path: T,*/ classObj: any, /* importMetaURL: string,*/ pera: IUcOptions, ...args: any[]): Usercontrol;
    static generateUCAsync<T = string>(/*path: T,*/ classObj: any, /* importMetaURL: string,*/ pera: IUcOptions, ...args: any[]): Promise<Usercontrol>;
    static GetResource: (guid: string) => {
        htmlFile: string;
        cssFile: string;
    };
    static generateTPT(classObj: any, pera: ITptOptions, ...args: any[]): Template;
    static generateTPTAsync(classObj: any, pera: ITptOptions, ...args: any[]): Promise<any>;
}
