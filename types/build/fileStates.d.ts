export interface IUcDepEntry {
    match: string;
    type: string;
    raw: string;
    abs: string;
}
export declare class UcDependencyScanner {
    path: typeof import('path');
    fs: typeof import('fs');
    constructor(path: typeof import('path'), fs: typeof import('fs'));
    static PATTERN: RegExp;
    ReplaceAll(content: string, baseDir: string, callback: (entry: IUcDepEntry) => string): string;
    forEachMatch(content: string, baseDir: string, callback: (entry: IUcDepEntry) => void): void;
    scan(filePath: string): IUcDepEntry[];
    scanTree(entryFile: string, visited?: Set<string>): IUcDepEntry[];
    private _buildEntry;
}
