export interface FILE_WARCHER_FILE_ROW {
    unlink: {
        [key: string]: number;
    };
    modified: {
        [key: string]: number;
    };
    add: {
        [key: string]: number;
    };
    moved: {
        from: string;
        to: string;
    }[];
    renamed: {
        from: string;
        to: string;
    }[];
}
export declare class ucUtil {
    static _getSelectedValuee: (_txt: HTMLInputElement | HTMLTextAreaElement) => string;
    static currentStyles(htmlEle: HTMLElement): CSSStyleDeclaration;
    static GetType(obj: any): string;
    static PHP_REMOVE(text: string): string;
    static PHP_ADD(text: string): string;
    static trimPath(pth: string): string;
    static JsonCopy<K>(obj: K): K;
    static distinct<T>(ar: Array<T>): Array<T>;
    static cleanNodeModulesPath(path: string): string;
    static changeExtension(path: string, fromExt: string, toExt: string): string;
    static toFilePath(path: string, trim?: boolean): string;
    static _trim_: (str: string, charlist?: string) => string;
    static escapeRegs: (str: string) => string;
    static devEsc: (str: string) => string;
}
export type SpecialExtType = "none" | ".uc" | ".tpt";
export declare enum SpecialExtEnum {
    none = "none",
    uc = ".uc",
    tpt = ".tpt"
}
