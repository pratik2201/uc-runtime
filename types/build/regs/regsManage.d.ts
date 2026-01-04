declare class regsManage {
    private switchRgx;
    private loopRgx;
    private proceeFindRegs;
    private tableColCellPattern;
    constructor();
    /**
     *
     * @param {{}} node
     * @param {string} content
     * @returns {string}
     */
    parse(node: {}, content: string): string;
    tText: any;
    static onDotPropCall: (node: object, cellname: string) => string;
    onDotPropCall: (node: object, cellname: string) => string;
    /**
     *
     * @param {string} content
     * @param {{}} node
     * @returns {string}
     */
    private _GET_CELL_VAL;
    static getValByNameSpace(obj: object, str: string): object;
}
export { regsManage };
