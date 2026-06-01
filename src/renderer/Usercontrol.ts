
import { ResourceKeyRegistry, ATTR_OF, GetUniqueId } from "ap-shared-core/core-common.js";
import { ExtractArguments, ISourceOptions, IUcOptions } from "../common/enumAndMore.js";
import { UserControl$Extended } from "./UsercontrolRes/UserControl$Extended.js";
import { IKeyStampNode } from "./StylerRegs.js";
import { CommonEvent } from "../core.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';

export class Usercontrol {
    static readonly guid: string;
    static MATERIAL: ISourceOptions = {
        htmlGuid: undefined as keyof ResourceKeyRegistry,
        cssGuid: undefined as keyof ResourceKeyRegistry,
    }
    static keys: IKeyStampNode;
    static parse(node: HTMLElement): Usercontrol { return node["#data"](ATTR_OF.BASE_OBJECT); }
    static HiddenSpace: HTMLElement = document.createElement('hspc' + GetUniqueId());
    static Event = {
        onReady: new CommonEvent<(uc: Usercontrol) => void>(),
        onElementParser: (e: HTMLElement) => {
            
        },
        //onUserControlExtended: new CommonEvent()
    }
    static UcOptionsStc: IUcOptions;
    static extractArgs = (args: IArguments) => ExtractArguments(args);
    constructor() {
        this.ucExtends = new UserControl$Extended();
        this.ucExtends.init(this); 
    }
    static templateMkr = new Map<string, string>();
    public ucExtends: UserControl$Extended;
}

