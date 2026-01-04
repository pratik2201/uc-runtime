interface OpenCloseCharNode {
    o: string;
    c: string;
}
export interface OCIterator {
    frontContent: string;
    betweenContent: string;
    level: number;
    child: OCIterator[];
}
export declare class OpenCloseHandler {
    ignoreList: OpenCloseCharNode[];
    parse(oc: OpenCloseCharNode, str: string): OCIterator[];
    doTask(openTxt: string, closeTxt: string, contents: string, callback?: (outText: string, inText: string, txtCount: number) => void): string;
}
export {};
