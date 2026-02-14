import { UcStates } from "../../common/enumAndMore.js";
import { CommonEvent } from "../../global/commonEvent.js";
import { Usercontrol } from "../Usercontrol.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export interface ITransferDataNode {
    type: "unknown" | "uc" | "uc-link" | "tpt" | "tpt-link" | "text" | "json" | "link";
    unqKey?: string;
    data?: any;
}
export declare const TransferDataNode: ITransferDataNode;
export declare class Usercontrol$Event {
    constructor(main: Usercontrol);
    private ucExtends;
    private main;
    private get dialogExt();
    private _contextChange;
    get contextChange(): CommonEvent<() => void>;
    private _afterInitlize;
    get afterInitlize(): CommonEvent<(uc: Usercontrol) => void>;
    private _activate;
    get activate(): CommonEvent<() => void>;
    private _deactivate;
    get deactivate(): CommonEvent<() => void>;
    beforeClose: CommonEvent<(args: {
        prevent?: boolean;
    }) => void>;
    afterClose: CommonEvent<(uc?: Usercontrol) => void>;
    onDestruction: CommonEvent<({}: {}) => void>;
    captionChanged: CommonEvent<(newCaptionText: string) => void>;
    winStateChanged: CommonEvent<(state: UcStates) => void>;
    beforeFreez: CommonEvent<(newUc: Usercontrol) => void>;
    beforeUnFreez: CommonEvent<(oldUc: Usercontrol) => void>;
    loaded: CommonEvent<() => void>;
    loadLastSession: CommonEvent<() => void>;
    onDataExport: (_data: ITransferDataNode) => boolean;
    onDataImport: (_data: ITransferDataNode) => boolean;
    sizeChanged: CommonEvent<(size: ResizeObserverEntry[]) => void>;
}
