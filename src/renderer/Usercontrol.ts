import { ATTR_OF, GetUniqueId } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { ExtractArguments, ISourceOptions, IUcOptions } from "../common/enumAndMore.js";
import { UserControl$Extended } from "./UsercontrolRes/UserControl$Extended.js";
import { ResourceKeyRegistry } from "ap-shared-core/out/enums.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';

export class Usercontrol {
    static readonly guid: string;
    static MATERIAL: ISourceOptions = {
        htmlGuid: undefined as keyof ResourceKeyRegistry,
        cssGuid: undefined as keyof ResourceKeyRegistry,
    }
    static parse(node: HTMLElement): Usercontrol { return node["#data"](ATTR_OF.BASE_OBJECT); }
    static HiddenSpace: HTMLElement = document.createElement('hspc' + GetUniqueId());
    static UcOptionsStc: IUcOptions;
    static extractArgs = (args: IArguments) => ExtractArguments(args);
    constructor() {
        this.ucExtends = new UserControl$Extended();
        this.ucExtends.init(this);
    }
    static templateMkr = new Map<string, string>();
    public ucExtends: UserControl$Extended;
}

