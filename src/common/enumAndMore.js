export function safeStringify(v) {
    if (typeof v === "string")
        return v;
    return JSON.stringify(v);
}
export function normalizeJSON(v) {
    while (typeof v === "string") {
        try {
            const parsed = JSON.parse(v);
            if (parsed === v)
                break;
            v = parsed;
        }
        catch {
            break;
        }
    }
    return v;
}
export class BuildResource {
    guid;
    name;
    type;
    content;
    source;
}
export class UserResource extends BuildResource {
    /**
     * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
     * THAT CSS AS PROJECT'S GLOBAL CSS
     */
    isGlobalCss = false;
    importar;
    project;
}
export class FileEntry {
    type = 'textFile';
    value = '';
    filePath;
}
export const getC = (c) => {
    if (c === undefined || c === null || isNaN(c))
        return "";
    return Object.getPrototypeOf(c).constructor.name;
};
export class objectOpt {
    /**
     * this will read `package.json` file from project's root directory and return project name
     * @param dirpath pass project's root directory path
     * @returns
     */
    static getProjectname(dirpath) {
        let fpath = `${dirpath}/package.json`;
        let pjson = require(fpath);
        if (pjson != undefined) {
            return pjson.name;
        }
        return undefined;
    }
    ;
    static copyProps(from, to) {
        // if (to == undefined) to = {} as T;
        let rtrn = this.clone(to);
        this.recursiveProp(from, rtrn);
        return rtrn;
    }
    static recursiveProp(from, to) {
        try {
            for (const key in from) {
                if (Object.hasOwnProperty.call(from, key)) {
                    const element = from[key];
                    if (getC(element) == "Object") {
                        let sobj = to[key];
                        if (sobj != undefined)
                            this.recursiveProp(element, sobj);
                        else
                            to[key] = element;
                    }
                    else {
                        to[key] = element;
                    }
                }
            }
        }
        catch (ex) {
            if (from === undefined)
                to = from;
            return;
        }
    }
    static clone(obj) {
        /*let cloned = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
        console.log(obj);
        console.log(cloned);
        return cloned;*/
        return JSON.parse(JSON.stringify(obj));
    }
    static copyAttr(from, to) {
        Array.from(from.attributes).forEach(s => to.setAttribute(s.name, s.value));
    }
    static getClassName(obj) {
        return Object.getPrototypeOf(obj).constructor.name;
    }
    static analysisObject(obj) {
        let rtrn = [];
        let npro;
        do {
            for (const key in Object.getOwnPropertyDescriptors(obj)) {
                let val = undefined;
                try {
                    val = obj[key];
                }
                catch (excp) { }
                let type = val != undefined ? this.getClassName(obj[key]) : "undefined";
                rtrn.push({
                    key: key,
                    type: type,
                    value: val
                });
            }
            obj = Object.getPrototypeOf(obj);
            npro = Object.getPrototypeOf(obj);
        } while ((npro != null || npro != undefined));
        return rtrn;
    }
}
export class ResourceKeyBridge {
    // how placeholders look in text
    static PREFIX = "__RES::";
    static SUFFIX = "__";
    // __RES::sharepnl:css:uuid__
    static PLACEHOLDER_RE = /__RES::([a-zA-Z0-9._:-]+)__/g;
    // ----------------------------
    // make "__RES::key__"
    // ----------------------------
    static makeKey(key) {
        return `${this.PREFIX}${key}${this.SUFFIX}`;
    }
    // ----------------------------
    // extract "sharepnl:css:uuid"
    // ----------------------------
    static extractKey(placeholder) {
        if (!placeholder.startsWith(this.PREFIX) || !placeholder.endsWith(this.SUFFIX))
            return null;
        return placeholder.slice(this.PREFIX.length, placeholder.length - this.SUFFIX.length);
    }
    // ----------------------------
    // find all keys inside text
    // ----------------------------
    static findAll(text) {
        const out = [];
        let m;
        this.PLACEHOLDER_RE.lastIndex = 0;
        while ((m = this.PLACEHOLDER_RE.exec(text))) {
            out.push(m[1]);
        }
        return out;
    }
    // ----------------------------
    // replace placeholders
    // ----------------------------
    static replace(text, resolver) {
        return text.replace(this.PLACEHOLDER_RE, (_m, key) => {
            return resolver(key);
        });
    }
    // ----------------------------
    // quick check
    // ----------------------------
    static isPlaceholder(value) {
        return value.startsWith(this.PREFIX) && value.endsWith(this.SUFFIX);
    }
}
export const SourceOptions = {
/*beforeContentAssign: (content) => {
    return content;
},*/
};
export const TemplatePathOptions = {
    accessKey: "",
    objectKey: "",
    htmlContents: "",
    cssContents: "",
};
export const UcOptions = {
    mode: 'client',
    accessName: '',
    //session: newObjectOpt.clone<SessionOptions>(sessionOptions),
    source: objectOpt.clone(SourceOptions),
    //loadAt: document.body,
    // decisionForTargerElement: 'append',  // waitForDecision
    events: {
        beforeInitlize: async (uc) => {
        },
        afterInitlize: async (uc) => {
        }
    },
};
export function ExtractArguments(args) {
    let cargs = args[0];
    if (cargs.toString() === '[object Arguments]') {
        return ExtractArguments(cargs);
    }
    else
        return args;
}
export const TptOptions = {
    MakeEmptyTemplate: false,
    source: objectOpt.clone(SourceOptions),
};
//namespace ucbuilder.global.objectOptions {
//# sourceMappingURL=enumAndMore.js.map