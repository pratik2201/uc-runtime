type LoopEachItemCallback = (obj: {}, content: string, nameSpace: string, loopCode: string) => string;
export declare class loopRegs {
    loopPattern: RegExp;
    constructor();
    parse(content: string, nodes: {}, eachItemcallback?: LoopEachItemCallback): string;
    parseDirect(node: {}, loopCode: string, valtoFind: string, subcontent: string, eachItemcallback?: LoopEachItemCallback): string;
}
export {};
