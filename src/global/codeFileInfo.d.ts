import { SpecialExtType } from "./ucUtil.js";
import { IFileDeclarationTypesMap, FileDeclarationTypes, ProjectRowR, DirDeclarationTypes, IResolvePathResult, IDirDeclarationTypesMap } from "../common/ipc/enumAndMore.js";
export declare function GetAliceInfoByPath(filePath: string, projectRows?: ProjectRowR[]): {
    alias: string;
    rootPath: string;
    absolutePath: string;
    project: ProjectRowR;
};
export declare function GetDeclaration(filepath: string, projectRows?: ProjectRowR[]): {
    project: import("../common/ipc/enumAndMore.js").ProjectRowBase<ProjectRowR>;
    dirDec: string;
    fileDec: string;
};
export declare class codeFileInfo {
    name: string;
    extCode: SpecialExtType;
    static getExtType(path: string): SpecialExtType;
    pathOf: IFileDeclarationTypesMap;
    resolvePathResult: IResolvePathResult;
    fullWithoutExt: (ftype: FileDeclarationTypes) => string;
    pathWithExt: (ftype: FileDeclarationTypes) => string;
    static GetFileName(filePath: string): string;
    allPathOf: IDirDeclarationTypesMap;
    callerMetaUrl: string;
    callerProject: ProjectRowR;
    get projectInfo(): ProjectRowR;
    parseUrl(_path: string, demandType: DirDeclarationTypes | string, callerMetaUrl?: string): boolean;
    get mainFileRootPath_btoa(): string;
}
