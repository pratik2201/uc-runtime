import { SpecialExtType } from "../global/ucUtil.js";
import { codeFileInfo } from "./codeFileInfo.js";
import { ScopeType } from "./common.js";
export declare class Control {
    private _name;
    get name(): string;
    set name(value: string);
    _nameQT: string;
    get nameQT(): string;
    _nameThis: string;
    get nameThis(): string;
    codeFilePath: string;
    type?: SpecialExtType;
    generic?: string;
    scope: ScopeType;
    proto: string;
    importedClassName?: string;
    src?: codeFileInfo;
    nodeName: string;
    constructor();
}
export interface Template {
    name: string;
    scope: ScopeType;
    controls: Control[];
}
export declare const templete: Template;
export interface ImportClassNameAlices {
    name: string;
    alias: string;
    asText?: string;
}
export interface ImportClassNode {
    url: string;
    names?: ImportClassNameAlices[];
}
export declare class CommonRow {
    src: codeFileInfo;
    codeFilePath: string;
    designerFilePath: string;
    htmlFilePath?: string;
    htmlFileContent?: string;
    baseClassName: string;
    designer: {
        extType: string;
        getterFunk: string;
        className: string;
        templetes: Template[];
        controls: Control[];
        importClasses: ImportClassNode[];
    };
    codefile: {
        className: string;
    };
    _extends: {
        _importedNames: {
            [name: string]: number;
        };
        addImport: (names: string[], url: string) => string[];
    };
}
export interface TempleteControl {
    name: string;
    nodeName: string;
    scope: ScopeType;
    proto: string;
}
export declare const templeteControl: TempleteControl;
