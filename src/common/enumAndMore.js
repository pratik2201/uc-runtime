import { ITemplateMeta, IUsercontrolMeta } from "ap-shared-core/out/ucbuilder/Template.js";
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
export const SourceOptions = {};
export const UcOptions = {
    mode: 'client',
    accessName: '',
    //session: newObjectOpt.clone<SessionOptions>(sessionOptions),
    source: new IUsercontrolMeta(), //objectOpt.clone<ISourceOptions>(SourceOptions),
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
    source: new ITemplateMeta, //objectOpt.clone<ISourceOptions>(SourceOptions),
};
//namespace ucbuilder.global.objectOptions {
//# sourceMappingURL=enumAndMore.js.map