import { ISourceOptions, IUcOptions, UCGenerateMode, UcStates, WhatToDoWithTargetElement } from "../common/enumAndMore.js";
import { IPassElementOptions, SourceNode } from "../lib/StampGenerator.js";
import { Assembly } from "../main/Assembly.js";
import { CSSVariableScope, VariableList } from "./StylerRegs.js";
export type UcDialogResult = "none" | "ok" | 'cancel' | 'close';
export type ucVisibility = 'inherit' | 'visible' | 'hidden';
export declare class Usercontrol {
    static readonly guid: string;
    static MATERIAL: ISourceOptions;
    static parse(node: HTMLElement): Usercontrol;
    static Resolver: (outDesignerImportMetaUrl: string, relPathOfOutHtml: string) => string;
    static HiddenSpace: HTMLElement;
    static UcOptionsStc: IUcOptions;
    static extractArgs: (args: IArguments) => IArguments;
    constructor();
    private hide;
    private destruct;
    static templateMkr: Map<string, string>;
    ucExtends: {
        readonly Context: any;
        SetContext: any;
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
        srcNode: SourceNode;
        assembly: Assembly;
        wrapperHT: HTMLElement;
        isDialogBox: boolean;
        cssGuid: string;
        htmlGuid: string;
        keepVisible: boolean;
        parentDependantIndex: number;
        dependant: Usercontrol[];
        isForm: boolean;
        readonly formExtends: {
            readonly Context: any;
            SetContext: any;
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
            srcNode: SourceNode;
            assembly: Assembly;
            wrapperHT: HTMLElement;
            isDialogBox: boolean;
            cssGuid: string;
            htmlGuid: string;
            keepVisible: boolean;
            parentDependantIndex: number;
            dependant: Usercontrol[];
            isForm: boolean;
            readonly formExtends: /*elided*/ any;
            readonly self: HTMLElement;
            caption: string;
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
            finalizeInitAsync: (param0: IUcOptions) => Promise<void>;
            finalizeInit: (param0: IUcOptions) => void;
            visibility: ucVisibility;
            getVisibility: () => ucVisibility;
            show: ({ at, defaultFocusAt, decision }?: {
                at?: HTMLElement;
                defaultFocusAt?: HTMLElement;
                decision?: WhatToDoWithTargetElement;
                visibility?: ucVisibility;
            }) => void;
            dialogResolver: (value: UcDialogResult) => void;
            showDialog: ({ defaultFocusAt, at, keepCurrentVisible, }?: {
                at?: HTMLElement;
                keepCurrentVisible?: boolean;
                defaultFocusAt?: HTMLElement;
            }) => Promise<"none" | "cancel" | "close" | "ok">;
            _windowstate: UcStates;
            windowstate: UcStates;
            getChildsRefByMainPath: (htmlGuid: string) => Usercontrol[];
            getFirstChildRefByMainPath: (htmlGuid: string) => Usercontrol;
            Events: {
                /** @private  */
                _contextChange: any;
                readonly contextChange: any;
                /** @private  */
                _afterInitlize: any;
                readonly afterInitlize: any;
                beforeClose: any;
                afterClose: any;
                onDestruction: any;
                captionChanged: any;
                winStateChanged: any;
                _activate: any;
                readonly activate: any;
                _deactivate: any;
                readonly deactivate: any;
                beforeFreez: any;
                beforeUnFreez: any;
                loaded: any;
                loadLastSession: any;
                /** @private  */
                _newSessionGenerate: any;
                readonly newSessionGenerate: any;
                /** @private  */
                _completeSessionLoad: any;
                readonly completeSessionLoad: any;
                sizeChanged: any;
                formExt: () => /*elided*/ any;
                dialogExt: () => /*elided*/ any;
                onDataExport: (_data: ITransferDataNode) => boolean;
                onDataImport: (_data: ITransferDataNode) => boolean;
            };
            distructOnClose: boolean;
            close: () => Promise<void>;
            passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions) => {
                [xname: string]: HTMLElement | HTMLElement[];
            };
            designer: {
                setCaption: (text: string) => void;
                getAllControls: () => {
                    [key: string]: HTMLElement | HTMLElement[];
                };
            };
        };
        readonly self: HTMLElement;
        caption: string;
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
        finalizeInitAsync: (param0: IUcOptions) => Promise<void>;
        finalizeInit: (param0: IUcOptions) => void;
        visibility: ucVisibility;
        getVisibility: () => ucVisibility;
        show: ({ at, defaultFocusAt, decision }?: {
            at?: HTMLElement;
            defaultFocusAt?: HTMLElement;
            decision?: WhatToDoWithTargetElement;
            visibility?: ucVisibility;
        }) => void;
        dialogResolver: (value: UcDialogResult) => void;
        showDialog: ({ defaultFocusAt, at, keepCurrentVisible, }?: {
            at?: HTMLElement;
            keepCurrentVisible?: boolean;
            defaultFocusAt?: HTMLElement;
        }) => Promise<"none" | "cancel" | "close" | "ok">;
        _windowstate: UcStates;
        windowstate: UcStates;
        getChildsRefByMainPath: (htmlGuid: string) => Usercontrol[];
        getFirstChildRefByMainPath: (htmlGuid: string) => Usercontrol;
        Events: {
            /** @private  */
            _contextChange: any;
            readonly contextChange: any;
            /** @private  */
            _afterInitlize: any;
            readonly afterInitlize: any;
            beforeClose: any;
            afterClose: any;
            onDestruction: any;
            captionChanged: any;
            winStateChanged: any;
            _activate: any;
            readonly activate: any;
            _deactivate: any;
            readonly deactivate: any;
            beforeFreez: any;
            beforeUnFreez: any;
            loaded: any;
            loadLastSession: any;
            /** @private  */
            _newSessionGenerate: any;
            readonly newSessionGenerate: any;
            /** @private  */
            _completeSessionLoad: any;
            readonly completeSessionLoad: any;
            sizeChanged: any;
            formExt: () => {
                readonly Context: any;
                SetContext: any;
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
                srcNode: SourceNode;
                assembly: Assembly;
                wrapperHT: HTMLElement;
                isDialogBox: boolean;
                cssGuid: string;
                htmlGuid: string;
                keepVisible: boolean;
                parentDependantIndex: number;
                dependant: Usercontrol[];
                isForm: boolean;
                readonly formExtends: /*elided*/ any;
                readonly self: HTMLElement;
                caption: string;
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
                finalizeInitAsync: (param0: IUcOptions) => Promise<void>;
                finalizeInit: (param0: IUcOptions) => void;
                visibility: ucVisibility;
                getVisibility: () => ucVisibility;
                show: ({ at, defaultFocusAt, decision }?: {
                    at?: HTMLElement;
                    defaultFocusAt?: HTMLElement;
                    decision?: WhatToDoWithTargetElement;
                    visibility?: ucVisibility;
                }) => void;
                dialogResolver: (value: UcDialogResult) => void;
                showDialog: ({ defaultFocusAt, at, keepCurrentVisible, }?: {
                    at?: HTMLElement;
                    keepCurrentVisible?: boolean;
                    defaultFocusAt?: HTMLElement;
                }) => Promise<"none" | "cancel" | "close" | "ok">;
                _windowstate: UcStates;
                windowstate: UcStates;
                getChildsRefByMainPath: (htmlGuid: string) => Usercontrol[];
                getFirstChildRefByMainPath: (htmlGuid: string) => Usercontrol;
                Events: {
                    /** @private  */
                    _contextChange: any;
                    readonly contextChange: any;
                    /** @private  */
                    _afterInitlize: any;
                    readonly afterInitlize: any;
                    beforeClose: any;
                    afterClose: any;
                    onDestruction: any;
                    captionChanged: any;
                    winStateChanged: any;
                    _activate: any;
                    readonly activate: any;
                    _deactivate: any;
                    readonly deactivate: any;
                    beforeFreez: any;
                    beforeUnFreez: any;
                    loaded: any;
                    loadLastSession: any;
                    /** @private  */
                    _newSessionGenerate: any;
                    readonly newSessionGenerate: any;
                    /** @private  */
                    _completeSessionLoad: any;
                    readonly completeSessionLoad: any;
                    sizeChanged: any;
                    formExt: () => /*elided*/ any;
                    dialogExt: () => /*elided*/ any;
                    onDataExport: (_data: ITransferDataNode) => boolean;
                    onDataImport: (_data: ITransferDataNode) => boolean;
                };
                distructOnClose: boolean;
                close: () => Promise<void>;
                passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions) => {
                    [xname: string]: HTMLElement | HTMLElement[];
                };
                designer: {
                    setCaption: (text: string) => void;
                    getAllControls: () => {
                        [key: string]: HTMLElement | HTMLElement[];
                    };
                };
            };
            dialogExt: () => {
                readonly Context: any;
                SetContext: any;
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
                srcNode: SourceNode;
                assembly: Assembly;
                wrapperHT: HTMLElement;
                isDialogBox: boolean;
                cssGuid: string;
                htmlGuid: string;
                keepVisible: boolean;
                parentDependantIndex: number;
                dependant: Usercontrol[];
                isForm: boolean;
                readonly formExtends: /*elided*/ any;
                readonly self: HTMLElement;
                caption: string;
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
                finalizeInitAsync: (param0: IUcOptions) => Promise<void>;
                finalizeInit: (param0: IUcOptions) => void;
                visibility: ucVisibility;
                getVisibility: () => ucVisibility;
                show: ({ at, defaultFocusAt, decision }?: {
                    at?: HTMLElement;
                    defaultFocusAt?: HTMLElement;
                    decision?: WhatToDoWithTargetElement;
                    visibility?: ucVisibility;
                }) => void;
                dialogResolver: (value: UcDialogResult) => void;
                showDialog: ({ defaultFocusAt, at, keepCurrentVisible, }?: {
                    at?: HTMLElement;
                    keepCurrentVisible?: boolean;
                    defaultFocusAt?: HTMLElement;
                }) => Promise<"none" | "cancel" | "close" | "ok">;
                _windowstate: UcStates;
                windowstate: UcStates;
                getChildsRefByMainPath: (htmlGuid: string) => Usercontrol[];
                getFirstChildRefByMainPath: (htmlGuid: string) => Usercontrol;
                Events: {
                    /** @private  */
                    _contextChange: any;
                    readonly contextChange: any;
                    /** @private  */
                    _afterInitlize: any;
                    readonly afterInitlize: any;
                    beforeClose: any;
                    afterClose: any;
                    onDestruction: any;
                    captionChanged: any;
                    winStateChanged: any;
                    _activate: any;
                    readonly activate: any;
                    _deactivate: any;
                    readonly deactivate: any;
                    beforeFreez: any;
                    beforeUnFreez: any;
                    loaded: any;
                    loadLastSession: any;
                    /** @private  */
                    _newSessionGenerate: any;
                    readonly newSessionGenerate: any;
                    /** @private  */
                    _completeSessionLoad: any;
                    readonly completeSessionLoad: any;
                    sizeChanged: any;
                    formExt: () => /*elided*/ any;
                    dialogExt: () => /*elided*/ any;
                    onDataExport: (_data: ITransferDataNode) => boolean;
                    onDataImport: (_data: ITransferDataNode) => boolean;
                };
                distructOnClose: boolean;
                close: () => Promise<void>;
                passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions) => {
                    [xname: string]: HTMLElement | HTMLElement[];
                };
                designer: {
                    setCaption: (text: string) => void;
                    getAllControls: () => {
                        [key: string]: HTMLElement | HTMLElement[];
                    };
                };
            };
            onDataExport: (_data: ITransferDataNode) => boolean;
            onDataImport: (_data: ITransferDataNode) => boolean;
        };
        distructOnClose: boolean;
        close: () => Promise<void>;
        passElement: (ele: HTMLElement | HTMLElement[], options?: IPassElementOptions) => {
            [xname: string]: HTMLElement | HTMLElement[];
        };
        designer: {
            setCaption: (text: string) => void;
            getAllControls: () => {
                [key: string]: HTMLElement | HTMLElement[];
            };
        };
    };
}
export interface ITransferDataNode {
    type: "unknown" | "uc" | "uc-link" | "tpt" | "tpt-link" | "text" | "json" | "link";
    unqKey?: string;
    data?: any;
}
export declare const TransferDataNode: ITransferDataNode;
