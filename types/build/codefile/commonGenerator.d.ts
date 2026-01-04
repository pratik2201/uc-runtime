import { SpecialExtType } from "../../global/ucUtil.js";
import { CommonRow } from "../buildRow.js";
import { regsManage } from "../regs/regsManage.js";
import { TemplateMaker } from "../regs/TemplateMaker.js";
interface CodeFilesNode {
    DESIGNER: string;
    CODE: string;
    STYLE: string;
}
interface BaseTypeNode {
    UC: CodeFilesNode;
    TPT: CodeFilesNode;
}
interface SourceTypeNode {
    JS: BaseTypeNode;
    TS: BaseTypeNode;
}
export declare class commonGenerator {
    rows: CommonRow[];
    DEFAULT_TEMPLEATES: SourceTypeNode;
    getfile(pth: string): string;
    designerTMPLT: {
        [key: string]: string;
    };
    codefileTMPLT: {
        [key: string]: string;
    };
    styleTMPLT: {
        [key: string]: string;
    };
    tMaker: TemplateMaker;
    constructor();
    rgxManage: regsManage;
    static ensureDirectoryExistence(filePath: string): void;
    static templateUnMapped: Map<string, string>;
    filex(type: 'js' | 'ts', extType: SpecialExtType, fileType: '.designer' | '.code' | '.style'): string;
    generateFiles(rows?: CommonRow[]): void;
    getDesignerCode(rw: CommonRow): string;
    getJsFileCode(rw: CommonRow): string;
    private generateNew;
}
export {};
