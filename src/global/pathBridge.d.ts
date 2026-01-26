import { DirDeclarationTypes, FileDeclarationTypes, IDirDeclarationTypesMap, ProjectRowBase } from "../common/ipc/enumAndMore.js";
export declare class PathBridge {
    static path: (typeof import("../renderer/nodeFn.js").nodeFn)['path'];
    static url: (typeof import("../renderer/nodeFn.js").nodeFn)['url'];
    static source: ProjectRowBase<any>[];
    static CheckAndSetDefault: () => void;
    static Convert: (path: string, pathDeclare: DirDeclarationTypes, givenFileType: FileDeclarationTypes, demandPathtype?: DirDeclarationTypes) => IDirDeclarationTypesMap;
    static changeExt: (path: string, from: FileDeclarationTypes, to: FileDeclarationTypes) => string;
    static GetFullPath: (path: string, basePath: string) => string;
}
