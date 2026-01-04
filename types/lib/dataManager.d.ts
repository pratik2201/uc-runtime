export declare class dataManager {
    source: {};
    map: {};
    static ATTR: {
        DM_DATA: string;
    };
    eventIncrementId: number;
    elementIncrementId: number;
    getId: (element: HTMLElement) => rowInfo;
    getElement(id: string): HTMLElement;
    fillObjectRef(targetObject: HTMLElement, arr: string[]): void;
    deleteObjectRef(targetObject: HTMLElement): void;
    getData(targetObject: HTMLElement, key?: string): any;
    setData(targetObject: HTMLElement, key: string, value?: any): void;
    compareElements(ele1: HTMLElement, ele2: HTMLElement): boolean;
    initElement(target: HTMLElement & HTMLElement[]): void;
    setEvent<K extends keyof HTMLElementEventMap>(element: HTMLElement, eventName: K, key: string, handler: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void;
    unSetEvent<K extends keyof HTMLElementEventMap>(element: HTMLElement, eventName: K, key?: string, handler?: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void;
    onHandler<K extends keyof HTMLElementEventMap>(element: HTMLElement, eventName: K, handler: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void;
    offHandler<K extends keyof HTMLElementEventMap>(element: HTMLElement, eventName: K, handler: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void;
}
export declare class rowInfo {
    id: string;
    data: {};
    event: {
        [key: string]: {};
    };
}
