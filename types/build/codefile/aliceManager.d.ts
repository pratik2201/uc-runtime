type AliceIdentifier = ":" | "-";
interface AliceRow {
    identifier?: AliceIdentifier;
    alice: string;
    path: string;
}
export declare class AliceManager {
    source: AliceRow[];
    patterns: {
        alice: RegExp;
        tag: RegExp;
    };
    constructor();
    fillAlices(htEle: HTMLElement): void;
    getAliceInfo(HtEle: HTMLElement): {
        controlName: string;
        identifier: AliceIdentifier;
        fullPath: string;
    };
}
export {};
