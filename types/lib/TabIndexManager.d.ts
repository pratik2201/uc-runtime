type TabStatus = 'backword' | 'forward' | 'none';
export interface TabContainerClearNode {
    target: HTMLElement;
    callback: (e: KeyboardEvent) => Promise<boolean | void>;
}
declare class TabIndexManager {
    static beep(): void;
    static stopFurther(e: Event, breakTheLoop?: boolean): void;
    mainHT: HTMLElement | undefined;
    private static _music;
    static get music(): boolean;
    static set music(value: boolean);
    private static _breakTheLoop;
    static get breakTheLoop(): boolean;
    static set breakTheLoop(value: boolean);
    static continueusMove: (container: HTMLElement, { startAt, stopAt }: {
        startAt?: HTMLElement;
        stopAt?: HTMLElement;
    }) => Promise<void>;
    constructor();
    static Events: {
        onContainerTopLeave: TabContainerClearNode[];
        onContainerTopEnter: TabContainerClearNode[];
        onContainerBottomLeave: TabContainerClearNode[];
        onContainerBottomEnter: TabContainerClearNode[];
    };
    static status: TabStatus;
    private static isInited;
    static init(): void;
    static movePrev: (target: HTMLElement, ev: KeyboardEvent, goAhead?: boolean) => Promise<void>;
    static getLastElement(container: HTMLElement, index?: number): HTMLElement;
    static getFirstElement(container: HTMLElement, index?: number): HTMLElement;
    static getAnyNextAfter(container: HTMLElement, currentIndex: number): any;
    static getAnyPreviousBefore(container: HTMLElement, currentIndex: number): any;
    static SKIP_CONTAINER_EVENTS: boolean;
    static _HELLO_KON: (ele: HTMLElement, e: KeyboardEvent, cnt: TabContainerClearNode[]) => Promise<boolean>;
    static moveNext: (target: HTMLElement, ev: KeyboardEvent, goAhead?: boolean) => Promise<void>;
    static getDirectParent(element: any): HTMLElement;
    static getDirectElement(container: HTMLElement, index: number): HTMLElement;
    static focusTo(htele: HTMLElement): void;
    static getTindex(target: HTMLElement): number | null;
    static getClosest(target: HTMLElement | Element): HTMLElement | null;
    static FOCUSABLE_ELEMENTS: string[];
    static isVisaulyAppeared(hte: HTMLElement): boolean;
    static isFocusableElement(hte: HTMLElement): boolean;
    static isDirectClose(child: HTMLElement, container: HTMLElement): boolean;
}
export { TabIndexManager };
