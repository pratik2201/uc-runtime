import { Usercontrol } from "../Usercontrol.js";
import { ATTR_OF } from "./runtimeOpt.js";

export interface FILE_WARCHER_FILE_ROW {
    unlink: { [key: string]: number },
    modified: { [key: string]: number },
    add: { [key: string]: number },
    moved: { from: string, to: string }[],
    renamed: { from: string, to: string }[],
}


export class ucUtil {
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
    //
    static selectAllText(elem: HTMLElement): void {
        if (!elem) return;

        // Input & textarea
        if (
            elem instanceof HTMLInputElement ||
            elem instanceof HTMLTextAreaElement
        ) {
            elem.select();
            return;
        }

        // Contenteditable or normal elements
        if (elem.isContentEditable) {
            const range = document.createRange();
            range.selectNodeContents(elem);

            const sel = window.getSelection();
            if (!sel) return;

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    static getArray(obj: any): any[] {
        if (obj == null) return [];

        // Single DOM element (HTML or SVG)
        if (obj instanceof Element) {
            return [obj];
        }

        // DOM collections
        if (
            obj instanceof HTMLCollection ||
            obj instanceof NodeList
        ) {
            return Array.from(obj);
        }

        // Already an array
        if (Array.isArray(obj)) {
            return obj;
        }

        // Any other iterable (Map, Set, arguments, etc.)
        if (typeof obj[Symbol.iterator] === "function") {
            return Array.from(obj);
        }

        // Fallback: wrap single value
        return [obj];
    }
    static setProp = function <K>(obj: Object, path: string, value: K) {
        try {
            const keys = path.split('.');
            let o = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                o = o[keys[i]] ||= {}; // Create nested object if missing
            }
            o[keys.at(-1)] = value;
            return true;
        } catch (ex) {
            return false;
        }
    };
    static getProp = (obj: Object, path: string | any): any => {
        const keys = path.split('.');
        let o = obj;
        for (let key of keys) {
            if (o == null) return undefined;
            o = o[key];
        }
        return o;
    };
    static _getSelectedValuee = (_txt: HTMLInputElement | HTMLTextAreaElement): string => {
        let child = _txt as HTMLInputElement;
        if (child.tagName === "TEXTAREA" ||
            (child.tagName === "INPUT" && child.type === "text")) {
            return child.value.substring(child.selectionStart, child.selectionEnd);
            // or return the return value of Tim Down's selection code here
        } else return child.innerText.substring(child.selectionStart, child.selectionEnd);
    };
    static currentStyles(htmlEle: HTMLElement) {
        let ele = htmlEle as HTMLElement;
        let css = ele["#data"](ATTR_OF.UC.CSSStyleDeclarations) as CSSStyleDeclaration;
        if (css == undefined) {
            css = window.getComputedStyle(ele);
            ele["#data"](ATTR_OF.UC.CSSStyleDeclarations, css);
        }
        return css;
    }
    static parseUc(ele: HTMLElement, val: Usercontrol) {
        if (val) {
            val.ucExtends.passElement(ele);
        }
        return ele;
    }
    static equalIgnoreCase(s1: string, s2: string) {
        return s1.toLowerCase() === s2.toLowerCase();
    }
    static parseStrByUc(content: string, val: Usercontrol) {
        var div = document.createElement('pre');
        div.innerHTML = content;
        if (val) {
            (val as Usercontrol).ucExtends.passElement(div);
            return div.innerHTML;
        } return content;
    }




    static GetType(obj: any): string { return Object.getPrototypeOf(obj).constructor.name; }
    static PHP_REMOVE(text: string) {
        return text.replace(/<\?(=|php| )(.*?)\?>/gm, '&lt;!--?$1$2?--&gt;');
    }
    static PHP_ADD(text: string) {
        return text.replace(/&lt;!--\?(=|php| )(.*?)\?--&gt;/gm, '<?$1$2?>');
    }

    static trimPath(pth: string) {
        return pth.replace(/^\.?\/*|\/*$/g, '');
    }
    static JsonCopy<K>(obj: K): K {
        return JSON.parse(JSON.stringify(obj));
    }
    static distinct<T>(ar: Array<T>): Array<T> {
        return [...new Set(ar)] as unknown as Array<T>;
    }
    static resolveSubNode(path: string) {
        return path.replace(/(?:\.\.[\/\\])+node_modules[\/\\]/i, '');
    }
    static changeExtension(path: string, fromExt: string, toExt: string) {
        // Ensure extensions start with a dot
        if (!fromExt.startsWith('.')) fromExt = '.' + fromExt;
        if (!toExt.startsWith('.')) toExt = '.' + toExt;

        // Replace the extension only if it matches
        if (path.endsWith(fromExt)) {
            return path.slice(0, -fromExt.length) + toExt;
        }

        // Otherwise, just append the new one
        return path;// + toExt;
    }
    static toFilePath(path: string, trim = true) {
        let ns = path.replace(/[\\\/]+/gi, "/");
        return trim ? this._trim_(ns, "/") : ns;
    }

    static _trim_ = (str: string, charlist?: string): string => {

        if (charlist === undefined)
            charlist = "\s";
        charlist = this.escapeRegs(charlist);
        return str.replace(new RegExp("^[" + charlist + "]+$", 'ig'), "");
    }
    static escapeRegs = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    static devEsc = (str: string): string => {
        // debugger;
        return str.replace(/(.{0,1}){:(.*?)}/gm, (m, fchar, url) => {
            //  console.log([m,fchar,url]);
            let rtrn = (fchar == "\\") ? `{:${url}}` : (fchar ?? '') + "" + url;
            return rtrn;
        });
    }
}

export type SpecialExtType = "none" | ".uc" | ".tpt" /*| ".t"*/;
export enum SpecialExtEnum {
    none = "none",
    uc = ".uc",
    tpt = ".tpt",
    // t = ".t"
}

