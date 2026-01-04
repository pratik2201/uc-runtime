import { FilterContent } from "../../global/filterContent.js";
import { IUCConfigPreference, UserUCConfig } from "../../ipc/enumAndMore.js";
import { ProjectRowR } from "../../ipc/enumAndMore.js";
import { builder } from "../builder.js";
import { CommonRow, Control, ImportClassNode } from "../buildRow.js";
import { TemplateMaker } from "../regs/TemplateMaker.js";
import { commonGenerator } from "./commonGenerator.js";
export interface PathReplacementNode {
    findPath: string;
    replaceWith: string;
}
export declare class commonParser {
    reset(): void;
    rows: CommonRow[];
    pathReplacement: PathReplacementNode[];
    pushReplacement({ findPath, replaceWith }: PathReplacementNode): void;
    bldr: builder;
    gen: commonGenerator;
    constructor(bldr: builder);
    CONFIG: UserUCConfig;
    PREFERENCE: IUCConfigPreference;
    project: ProjectRowR;
    PROJECT_PATH_LENGTH: number;
    init(filePath: string, htmlContents?: string | undefined): void;
    tmaker: TemplateMaker;
    _filterText: FilterContent;
    codeHT: HTMLElement;
    fill(filePath: string, htmlContents?: string | undefined): CommonRow;
    uc(_path: string, fromPath: string): string;
    fillDefImports(name: string, url: string, classList: ImportClassNode[], ctrlNode?: Control): void;
}
