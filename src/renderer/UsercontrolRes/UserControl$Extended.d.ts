import { ResourceKeyList } from "ap-shared-core/out/enums.js";
import { IUsercontrolContent } from "ap-shared-core/out/uc-runtime/Template.js";
import { IUcOptions, UCGenerateMode, UcStates, WhatToDoWithTargetElement } from "../../common/enumAndMore.js";
import { IPassElementOptions, SourceNode } from "../../lib/StampGenerator.js";
import { Assembly } from "../Assembly.js";
import { CSSVariableScope, VariableList } from "../StylerRegs.js";
import { Usercontrol } from "../Usercontrol.js";
import { Usercontrol$Event } from "./Usercontrol$Event.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export interface ITransferDataNode {
    type: "unknown" | "uc" | "uc-link" | "tpt" | "tpt-link" | "text" | "json" | "link";
    unqKey?: string;
    data?: any;
}
export declare const TransferDataNode: ITransferDataNode;
export declare class UserControl$Extended {
    constructor();
    private main;
    init(main: Usercontrol): void;
    get Context(): any;
    set SetContext(context: any);
    DialogResult: UcDialogResult;
    mode: UCGenerateMode;
    ___META: {
        CONTEXT: any;
        PREV_CREATED_ID: any;
        PREV_UPDATED_ID: any;
        SELECTED_ID: any;
        CLOSE_ON_SAVE: boolean;
    };
    form: Usercontrol;
    dialogForm: Usercontrol;
    PARENT: Usercontrol;
    resource: IUsercontrolContent;
    srcNode: SourceNode;
    assembly: Assembly;
    wrapperHT: HTMLElement;
    isDialogBox: boolean;
    guid: ResourceKeyList;
    keepVisible: boolean;
    parentDependantIndex: number;
    dependant: Usercontrol[];
    isForm: boolean;
    get formExtends(): UserControl$Extended;
    get self(): HTMLElement<any>;
    lastFocuedElement: HTMLElement;
    keepVisible_Till_I_Exist: (I: Usercontrol) => void;
    find: (skey: string) => HTMLElement[];
    initalComponents: {
        targetElement: HTMLElement;
        elements: HTMLCollection;
        stageHT: HTMLElement;
        changeStage: (newStage: HTMLElement) => boolean;
    };
    setCssVariable: (varList: VariableList, scope: CSSVariableScope) => void;
    getCssVariable: (key: string, scope: CSSVariableScope) => string;
    cssVarStampKey: string;
    initializecomponent: (param0: IUcOptions) => void;
    controls: {
        [xname: string]: HTMLElement | HTMLElement[];
    };
    resizerObserver: ResizeObserver;
    finalizeInit: (param0: IUcOptions) => void;
    takeoff: () => void;
    visibility: ucVisibility;
    getVisibility: () => ucVisibility;
    show: ({ at, defaultFocusAt, decision }?: {
        at?: HTMLElement;
        defaultFocusAt?: HTMLElement;
        decision?: WhatToDoWithTargetElement;
        visibility?: ucVisibility;
    }) => void;
    dialogResolver: (value: UcDialogResult) => void;
    showDialog: ({ defaultFocusAt, at, keepCurrentVisible }?: {
        at?: HTMLElement;
        keepCurrentVisible?: boolean;
        defaultFocusAt?: HTMLElement;
    }) => Promise<"cancel" | "close" | "none" | "ok">;
    _windowstate: UcStates;
    get windowstate(): UcStates;
    set windowstate(state: UcStates);
    getChildsRefByMainPath: (guid: string) => Usercontrol[];
    getFirstChildRefByMainPath: (guid: string) => Usercontrol;
    Events: Usercontrol$Event;
    distructOnClose: boolean;
    close: () => Promise<void>;
    passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions) => {
        [xname: string]: HTMLElement | HTMLElement[];
    };
    set caption(text: string);
    get caption(): string;
    designer: {
        setCaption: (text: string) => void;
        getAllControls: () => {
            [key: string]: HTMLElement | HTMLElement[];
        };
    };
    private hide;
    private destruct;
}
