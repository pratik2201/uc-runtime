import { ISourceOptions, IUcOptions } from "../common/enumAndMore.js";
import { UserControl$Extended } from "./UsercontrolRes/UserControl$Extended.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export declare class Usercontrol {
    static readonly guid: string;
    static MATERIAL: ISourceOptions;
    static parse(node: HTMLElement): Usercontrol;
    static HiddenSpace: HTMLElement;
    static UcOptionsStc: IUcOptions;
    static extractArgs: (args: IArguments) => IArguments;
    constructor();
    static templateMkr: Map<string, string>;
    ucExtends: UserControl$Extended;
}
