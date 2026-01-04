export declare class TSPathResolver {
    static isSamePath(a: string, b: string): boolean;
    private static instance;
    private config;
    private baseDir;
    private paths;
    private outDir?;
    private constructor();
    static getInstance(tsconfigPath?: string): TSPathResolver;
    private loadTSConfig;
    private findTSConfig;
    /**
     * Strip comments without touching text inside strings.
     */
    private stripCommentsSafe;
    resolve(importPath: string, importer?: string): string;
    static subtractPath(basePath: string, targetPath: string): string;
    resolveOut(importPath: string, importer?: string): string;
    info(): {
        baseDir: string;
        outDir: string;
        paths: Record<string, string[]>;
    };
}
