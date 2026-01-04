export type BrowserConfig = {
    importmap?: Record<string, string>;
    globalAlias?: Record<string, string>;
};
export type ProjectEntry = {
    rootPath: string;
    projectName: string;
    browser: BrowserConfig;
};
export declare function scanAllProjects(mainRoot?: string): ProjectEntry[];
export declare function createImportMap(projects: ProjectEntry[]): {
    scopes: Record<string, Record<string, string>>;
};
