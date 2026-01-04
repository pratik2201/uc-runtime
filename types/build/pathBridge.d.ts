import { ISourceFileTypeMap, SourceType, SourceFileType, ProjectRowBase } from "../ipc/enumAndMore.js";
export declare class PathBridge {
    static path: (typeof import("../nodeFn.js").nodeFn)['path'];
    static url: (typeof import("../nodeFn.js").nodeFn)['url'];
    static source: ProjectRowBase<any>[];
    static CheckAndSetDefault: () => void;
    static Convert: (path: string, pathtype?: SourceType, givenFileType?: SourceFileType, demandPathtype?: SourceType) => ISourceFileTypeMap;
    static changeExt: (path: string, from: SourceFileType, to: SourceFileType) => string;
    static GetFullPath: (path: string, basePath: string) => string;
}
