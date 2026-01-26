import { CommonEvent } from "../global/commonEvent.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
import { KeyboardKey } from "./hardware.js";
type ShortcutCallback = (e: KeyboardEvent) => void;
export declare class ShortcutNode {
    private shortcutMap;
    register(keys: KeyboardKey[][], callback: ShortcutCallback, override?: boolean): string[];
    /** Unregister a shortcut */
    unregister(keys: KeyboardKey[]): string[];
    /** Clear all shortcuts */
    clear(): void;
    callTask(combo: string, e: KeyboardEvent): boolean;
}
export declare class ShortcutManager {
    private pressedKeys;
    source: ShortcutNode[];
    CreateLayer(): ShortcutNode;
    constructor();
    /** Destroy manager and remove all listeners */
    destroy(): void;
    /** Normalize key combination to string */
    private static getComboString;
    private _keydown;
    private _keyup;
    private _blur;
}
interface WinNode {
    uc?: Usercontrol;
    display?: string;
    lastFocusedAt?: HTMLElement;
}
export declare class FocusManager {
    currentElement: HTMLElement | undefined;
    Event: {
        onFatch: CommonEvent<(ele: HTMLElement) => void>;
        onFocus: CommonEvent<(ele: HTMLElement) => void>;
    };
    fetch(ele: HTMLElement): void;
    /**
     *
     * @param containerElement if last focused element not insde `contaierElement` than direct focus to `containerElement`
     */
    focus(containerElement?: HTMLElement): void;
}
export declare class WinManager {
    static IS_REPEAT: boolean;
    static RepeatPauseInMilliSeconds: number;
    static shortcutManage: ShortcutManager;
    static isSameKey: <T>(arr1: T[], arr2: T[]) => boolean;
    static initEvent(): void;
    static event: {
        onFreez: (uc: Usercontrol) => void;
        onUnFreez: (uc: Usercontrol) => void;
        keydown: CommonEvent<(e: KeyboardEvent) => void>;
        keyup: CommonEvent<(e: KeyboardEvent) => void>;
    };
    static ACCESS_KEY: string;
    static getNode(htNode: HTMLElement): WinNode;
    static setNode(htNode: HTMLElement): WinNode;
    static focusMng: FocusManager;
    static push: (form: Usercontrol) => Promise<void>;
    static pop: (form: Usercontrol) => Promise<void>;
    static ATTR: {
        DISABLE: {
            NEW_VALUE: string;
            OLD_VALUE: string;
        };
        INERT: {
            NEW_VALUE: string;
            OLD_VALUE: string;
        };
    };
    static setfreez: (freez: boolean, wnode: WinNode) => Promise<void>;
    static FreezThese(freez: boolean, ...elements: HTMLElement[]): Promise<void>;
    static captureElementAsImage(element: HTMLElement): string;
}
export {};
