export declare class TemplateMaker {
    mainImportMeta: string;
    templateCache: Map<string, Function>;
    constructor(mainImportMeta: string);
    private loadTemplate;
    compileTemplate(template: string): Function;
}
