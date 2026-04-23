import { UcStates } from "../../common/enumAndMore.js";
import { CommonEvent } from "../../global/commonEvent.js";
import { Usercontrol } from "../Usercontrol.js";
import { UserControl$Extended } from "./UserControl$Extended.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export interface ITransferDataNode {
    type: "unknown" | "uc" | "uc-link" | "tpt" | "tpt-link" | "text" | "json" | "link";
    unqKey?: string;
    data?: any;
}
export const TransferDataNode: ITransferDataNode = {
    type: "unknown",
    unqKey: '',
    data: undefined,
};

export class Usercontrol$Event {
    constructor(main: Usercontrol) {
        this.ucExtends = main.ucExtends;
        this.main = main;
    }
    private ucExtends: UserControl$Extended;
    private main: Usercontrol;
    //private get formExt() { return this.ucExtends.form.ucExtends; }
    private get dialogExt() { return this.ucExtends.dialogForm.ucExtends; }

    private _contextChange = new CommonEvent<() => void>();
    get contextChange() { return this.dialogExt.Events._contextChange; };
    private _afterInitlize = new CommonEvent<(uc: Usercontrol) => void>();
    get afterInitlize() { return this.dialogExt.Events._afterInitlize; };

    private _activate = new CommonEvent<() => void>();
    get activate() { return this.dialogExt.Events._activate; };
    private _deactivate = new CommonEvent<() => void>();
    get deactivate() { return this.dialogExt.Events._deactivate; };


    // @ts-ignore
    beforeClose = new CommonEvent<(args: { prevent?: boolean }) => void>();
    afterClose = new CommonEvent<(uc?: Usercontrol) => void>();
    afterHide = new CommonEvent<(uc?: Usercontrol) => void>();
    onDestruction = new CommonEvent<({ }) => void>();

    captionChanged = new CommonEvent<(newCaptionText: string) => void>();
    winStateChanged = new CommonEvent<(state: UcStates) => void>();

    beforeFreez = new CommonEvent<(newUc: Usercontrol) => void>();
    beforeUnFreez = new CommonEvent<(oldUc: Usercontrol) => void>();
    loaded = new CommonEvent<() => void>();
    loadLastSession = new CommonEvent<() => void>();
    onDataExport = (_data: ITransferDataNode) => { return false; };
    onDataImport = (_data: ITransferDataNode) => { return false; };
    sizeChanged = new CommonEvent<(size: ResizeObserverEntry[]) => void>();
}