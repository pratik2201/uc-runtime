import { ResourceKeyList } from "ap-shared-core/out/ucbuilder/resources/enums.js";
export declare class CssRuntimeResolver {
    private loaded;
    resolveFromKey(cssKey: ResourceKeyList): string;
    resolveFromContent(cssContent: string): string;
    private resolveCss;
    resolveImports(css: string): string;
    resolveUrls(css: string): string;
}
