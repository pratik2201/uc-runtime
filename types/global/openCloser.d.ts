interface OpenCloseCharNode {
    openingChar: string;
    closingChar: string;
}
export declare class openCloser {
    ignoreList: OpenCloseCharNode[];
    doTask(openTxt: string, closeTxt: string, contents: string, callback?: (outText: string, inText: string, txtCount: number) => void): string;
}
export {};
