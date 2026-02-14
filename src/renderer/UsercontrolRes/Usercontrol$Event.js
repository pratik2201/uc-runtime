import { CommonEvent } from "../../global/commonEvent.js";
export const TransferDataNode = {
    type: "unknown",
    unqKey: '',
    data: undefined,
};
export class Usercontrol$Event {
    constructor(main) {
        this.ucExtends = main.ucExtends;
        this.main = main;
    }
    ucExtends;
    main;
    //private get formExt() { return this.ucExtends.form.ucExtends; }
    get dialogExt() { return this.ucExtends.dialogForm.ucExtends; }
    _contextChange = new CommonEvent();
    get contextChange() { return this.dialogExt.Events._contextChange; }
    ;
    _afterInitlize = new CommonEvent();
    get afterInitlize() { return this.dialogExt.Events._afterInitlize; }
    ;
    _activate = new CommonEvent();
    get activate() { return this.dialogExt.Events._activate; }
    ;
    _deactivate = new CommonEvent();
    get deactivate() { return this.dialogExt.Events._deactivate; }
    ;
    // @ts-ignore
    beforeClose = new CommonEvent();
    afterClose = new CommonEvent();
    onDestruction = new CommonEvent();
    captionChanged = new CommonEvent();
    winStateChanged = new CommonEvent();
    beforeFreez = new CommonEvent();
    beforeUnFreez = new CommonEvent();
    loaded = new CommonEvent();
    loadLastSession = new CommonEvent();
    onDataExport = (_data) => { return false; };
    onDataImport = (_data) => { return false; };
    sizeChanged = new CommonEvent();
}
//# sourceMappingURL=Usercontrol$Event.js.map