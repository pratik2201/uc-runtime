export declare class dataManager {
    static ATTR: {
        DM_DATA: string;
    };
    eventIncrementId: number;
    elementIncrementId: number;
    getId: (element: HTMLElement) => rowInfo;
    getData(targetObject: HTMLElement, key?: string): any;
    setData(targetObject: HTMLElement, key: string, value?: any): void;
    initElement(target: HTMLElement & HTMLElement[]): void;
}
export declare class rowInfo {
    id: string;
    data: {};
    event: {
        [key: string]: {};
    };
}
