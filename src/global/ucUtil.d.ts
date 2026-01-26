import { Usercontrol } from "../renderer/Usercontrol.js";
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
    /** old one
     selectAllText(elem: HTMLElement): void {
        if ((elem as HTMLInputElement).select) (elem as HTMLInputElement).select();
        else selectElementContents(elem);
        function selectElementContents(el: HTMLElement) {
            if (!el.isContentEditable) return;
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            try {
                sel.addRange(range);
            } catch (exp) {
                console.log(exp);
            }
        }
    }
     */
    static selectAllText(elem: HTMLElement): void;
    static getArray(obj: any): any[];
    static setProp: <K>(obj: Object, path: string, value: K) => boolean;
    static getProp: (obj: Object, path: string | any) => any;
    static _getSelectedValuee: (_txt: HTMLInputElement | HTMLTextAreaElement) => string;
    static currentStyles(htmlEle: HTMLElement): CSSStyleDeclaration;
    static parseUc(ele: HTMLElement, val: Usercontrol): HTMLElement;
    static equalIgnoreCase(s1: string, s2: string): boolean;
    static parseStrByUc(content: string, val: Usercontrol): string;
    static GetType(obj: any): string;
    static PHP_REMOVE(text: string): string;
    static PHP_ADD(text: string): string;
    static trimPath(pth: string): string;
    static JsonCopy<K>(obj: K): K;
    static distinct<T>(ar: Array<T>): Array<T>;
    static resolveSubNode(path: string): string;
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
