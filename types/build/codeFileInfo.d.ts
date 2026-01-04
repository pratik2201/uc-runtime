import { SpecialExtType } from "../global/ucUtil.js";
import { ISourceFileTypeMap, SourceFileType, ProjectRowR, SourceType, IResolvePathResult } from "../ipc/enumAndMore.js";
export declare class codeFileInfo {
    name: string;
    extCode: SpecialExtType;
    constructor(extCode: SpecialExtType);
    static getExtType(path: string): SpecialExtType;
    pathOf: ISourceFileTypeMap;
    resolvePathResult: IResolvePathResult;
    fullWithoutExt: (ftype: SourceFileType) => string;
    pathWithExt: (ftype: SourceFileType) => string;
    static GetFileName(filePath: string): string;
    callerMetaUrl: string;
    actualProject: ProjectRowR;
    get projectInfo(): ProjectRowR;
    parseUrl(_path: string, sourceType: SourceType, _basepath_metaurl: string): boolean;
    get mainFileRootPath_btoa(): string;
}
