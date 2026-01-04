import { CommonEvent } from "../global/commonEvent.js";
import { ProjectRowR } from "../ipc/enumAndMore.js";
import { CommonRow } from "./buildRow.js";
import { commonParser } from "./codefile/commonParser.js";
import { codeFileInfo } from "./codeFileInfo.js";
import { fileWatcher } from "./fileWatcher.js";
export interface SourceCodeNode {
    designerCode?: string;
    jsFileCode?: string;
    htmlCode?: string;
}
export declare class builder {
    private ignoreDirs;
    project: ProjectRowR;
    ROOT_DIR: string;
    private static INSTANCE;
    static GetInstance(): builder;
    constructor();
    projectDir: string;
    addToIgnore: (...pathlist: string[]) => void;
    commonMng: commonParser;
    filewatcher: fileWatcher;
    Event: {
        onSelect_xName: CommonEvent<(ele: HTMLElement, row: CommonRow) => void>;
    };
    getAllDesignerXfiles(): Promise<any[]>;
    buildALL(onComplete?: () => void, _fillReplacerPath?: boolean): Promise<void>;
    _ignoreThis: (pth: string) => boolean;
    /** @private */
    recursive(parentDir: string, /*ignoreDir = this.ignoreDirs,*/ ignoreThis: (pth: string) => boolean, callback: (path: string) => void): void;
    /** @param {codeFileInfo} fInfo */
    buildFiles(fInfos: codeFileInfo[], onComplete?: () => void): void;
    getOutputCode(fInfo: codeFileInfo, htmlContents: string): SourceCodeNode;
    checkFileState(filePath: string, htmlContents?: string): void;
}
