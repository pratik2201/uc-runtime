import { Usercontrol } from "../Usercontrol.js";
export interface PreDefinedPropertiesHTML<S = any> {
    'tabindex'?: number;
    'x-tabindex'?: number;
    'x-from'?: string;
    id?: string;
    'x-caption'?: string;
    style?: string;
    '<childs>': string[];
}
export declare class WrapperHelper<S = any> {
    constructor(importMeta: string);
    private importMeta;
    static Tag: ([tagName, prefDefinedProps]: [string?, Partial<PreDefinedPropertiesHTML<any>>?], ...childs: string[]) => string;
    Wrapper: ([wrapperProps]: [Partial<PreDefinedPropertiesHTML<S>>?, Partial<PreDefinedPropertiesHTML<S>>?], ...childs: string[]) => string;
    static Usercontrol: ([name, obj, htmlFilePath, ucProps]: [string?, (typeof Usercontrol)?, string?, Partial<PreDefinedPropertiesHTML<any>>?], ...childs: string[]) => string;
}
