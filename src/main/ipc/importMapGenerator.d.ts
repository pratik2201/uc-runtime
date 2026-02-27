export type BrowserConfig = {
    importmap?: Record<string, string>;
    globalAlias?: Record<string, string>;
};
export type ProjectEntry = {
    rootPath: string;
    projectName: string;
    browser: BrowserConfig;
};
export declare function ensureHead(): HTMLHeadElement;
export declare function scanAllProjects(mainRoot?: string): Promise<ProjectEntry[]>;
export declare function createImportMap(htmlPath: string, projects: ProjectEntry[], baseDir?: string): {
    scopes: Record<string, Record<string, string>>;
};
export declare function injectImportMap(htmlContent: string, importMap: any): string;
