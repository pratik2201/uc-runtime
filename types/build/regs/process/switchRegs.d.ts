export declare class switchRegs {
    switchPattern: RegExp;
    casePattern: RegExp;
    constructor();
    /**
     *
     * @param {string} content
     * @param {{}} node
     * @param {Function} caseText
     * @returns
     */
    parse(content: string, node: {}, caseText?: Function): string;
    parseDirect(node: {}, valtoFind: string, subcontent: string, caseText?: Function): string;
    /**
     *
     * @param {string} content
     * @param {string} valtoMatch
     * @returns
     */
    parseCase(content: string, valtoMatch: string): string;
}
