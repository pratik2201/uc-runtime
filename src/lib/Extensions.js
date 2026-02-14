import { dataManager } from "./dataManager.js";
export class Extensions {
    static data = new dataManager();
    static isInited = false;
    static init() {
        if (Extensions.isInited)
            return;
        this.doCommonDomProto(HTMLElement.prototype);
        this.doCommonDomProto(Element.prototype);
        this.doCommonDomProto(EventTarget.prototype);
        Array.prototype["#distinct"] = function () {
            return [...new Set(this)];
        };
        Array.prototype["#RemoveMultiple"] = function (...eleList) {
            var valuesArr = this;
            const indices = [];
            let findex = -1;
            for (let i = 0; i < eleList.length; i++) {
                findex = valuesArr.indexOf(eleList[i]);
                if (findex != -1)
                    indices.push(findex);
            }
            valuesArr["#RemoveByFilter"](row => eleList.indexOf(row) == -1);
            //  console.log(eleList);
            return [];
            //return valuesArr.RemoveAtMultiple(...indices);
        };
        Array.prototype["#RemoveByFilter"] = function (callback) {
            let i, j;
            for (i = 0, j = 0; i < this.length; ++i) {
                if (callback(this[i])) {
                    this[j] = this[i];
                    ++j;
                }
            }
            while (j < this.length) {
                this.pop();
            }
        };
        Array.prototype["#RemoveAtMultiple"] = function (...removeValFromIndex) {
            var valuesArr = this;
            removeValFromIndex.sort(function (a, b) { return b - a; });
            let removedEle = [];
            for (var i = removeValFromIndex.length - 1; i >= 0; i--)
                return valuesArr.splice(removeValFromIndex[i], 1);
        };
        Array.prototype["#fillInto"] = function (to, clearTarget = false) {
            let from = this;
            if (clearTarget)
                to.length = 0;
            for (let i = 0, len = from.length; i < len; i++)
                to.push(from[i]);
        };
        Array.prototype["#fillIntoMultiple"] = function (to, clearTarget = false) {
            let from = this;
            if (clearTarget) {
                for (let i = 0, iObj = to, ilen = iObj.length; i < ilen; i++) {
                    iObj[i].length = 0;
                }
            }
            for (let i = 0, iObj = from, ilen = iObj.length; i < ilen; i++) {
                const iItem = iObj[i];
                for (let j = 0, jObj = to, jlen = jObj.length; j < jlen; j++) {
                    jObj[j].push(iItem);
                }
            }
        };
        SVGElement.prototype["#data"] = function (key, value) {
            switch (arguments.length) {
                case 0:
                    return Extensions.data.getData(this);
                    break;
                case 1:
                    switch (typeof key) {
                        case "string": return Extensions.data.getData(this, key);
                        case "object": Extensions.data.getData(this, key);
                    }
                    break;
                case 2:
                    Extensions.data.setData(this, key, value);
                    break;
            }
        };
        Number.prototype["#toAlphabate"] = function () {
            var arr = [];
            let count = this;
            while (count >> 0 > 0) {
                arr.unshift(String.fromCharCode(65 + --count % 26));
                count /= 26;
            }
            return arr.join("");
        };
        String.prototype["#escapeRegs"] = function () {
            return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        String.prototype["#replaceAllWithResult"] = function (find, replace) {
            let hasReplaced = false;
            let content = this.replace(new RegExp(find["#escapeRegs"](), 'gi'), () => {
                hasReplaced = true;
                return replace;
            });
            return {
                result: content,
                hasReplaced: hasReplaced
            };
        };
        String.prototype["#$"] = function () {
            var div = document.createElement('pre');
            div.innerHTML = this.trim();
            if (div.children.length == 1) {
                Extensions.data.initElement(div.firstChild);
                return div.firstChild;
            }
            else {
                let ar = Array.from(div.children);
                Extensions.data.initElement(ar);
                return ar;
            }
        };
        // String.prototype["#PHP_REMOVE"] = function () {
        //     return ucUtil.PHP_REMOVE(this as string);
        // }
        // String.prototype["#PHP_ADbD"] = function () {
        //     return ucUtil.PHP_bADD(this as string);
        // }
        /*String.prototype.templateBind = function (row) {
            return ''; //generateTemplateString(this)(row);
        }*/
        String.prototype["#startsWithI"] = function (s) {
            return this.toLowerCase().startsWith(s.toLowerCase());
        };
        String.prototype["#endsWithI"] = function (s) {
            return this.toLowerCase().endsWith(s.toLowerCase());
        };
        String.prototype["#includesI"] = function (s) {
            let index = (this.toLowerCase()).indexOf(s.toLowerCase());
            if (index != -1)
                return { result: true, index: index };
            else
                return { result: false, index: -1 };
        };
        // String.prototype["#convertToFullPath"] = function (this: string, importUrl?: string): IResolvePathResult {
        //     let fpath = ProjectManage.reso4lvePathObject(this, importUrl);   
        //     fpath.result = fpath.result?.["#toFilePath"]();
        //     return fpath;
        // }
        // String.prototype["#devEsc"] = function (this: string): string {
        //      return ucUtil.devEsc(this);
        //     // return this.replace(/(.{0,1}){:(.*?)}/gm, (m, fchar, url) => {
        //     //   //  console.log([m,fchar,url]);
        //     //     let rtrn = (fchar == "\\") ? `{:${url}}` : (fchar ?? '') + "" + url;
        //     //     return rtrn;
        //     // });
        // }
        String.prototype["#_trim_"] = function (charlist) {
            if (charlist === undefined)
                charlist = "\s";
            charlist = charlist["#escapeRegs"]();
            return this.replace(new RegExp("^[" + charlist + "]+$", 'ig'), "");
        };
        String.prototype["#_trim"] = function (charlist) {
            if (charlist === undefined)
                charlist = "\s";
            charlist = charlist["#escapeRegs"]();
            return this.replace(new RegExp("^[" + charlist + "]+", 'ig'), "");
        };
        String.prototype["#_trimText"] = function (charlist) {
            if (charlist === undefined)
                charlist = "\s";
            charlist = charlist["#escapeRegs"]();
            let pattern = new RegExp("^" + charlist + "", 'ig');
            return this.replace(pattern, "");
        };
        String.prototype["#trim_"] = function (charlist) {
            if (charlist === undefined)
                charlist = "\s";
            charlist = charlist["#escapeRegs"]();
            return this.replace(new RegExp("[" + charlist + "]+$", 'ig'), "");
        };
        String.prototype["#trimText_"] = function (charlist) {
            if (charlist === undefined)
                charlist = "\s";
            charlist = charlist["#escapeRegs"]();
            ``;
            let pattern = new RegExp("" + charlist + "$", 'ig');
            return this.replace(pattern, "");
        };
        String.prototype["#toFilePath"] = function (trim = true) {
            let ns = this.replace(/[\\\/]+/gi, "/");
            return trim ? ns["#_trim_"]("/") : ns;
        };
        String.prototype["#removeExtension"] = function (extList) {
            let str = this;
            let ptr, reg, flag = "g";
            if (extList != undefined) {
                ptr = extList.join('|');
                reg = "\\.(${ptr})$";
            }
            else {
                reg = "\\.[^.]+";
            }
            return str.replace(new RegExp(reg, flag), "");
        };
        Object.defineProperty(Object.prototype, "getType", {
            value: function () {
                if (this == undefined || this == null)
                    return this + '';
                return Object.getPrototypeOf(this)?.constructor.name;
            },
            enumerable: false, // Prevents from showing up in for...in
            writable: true,
            configurable: true,
        });
        //console.log(`hello {=s}`.__({ s: 'd' }).then(s => s));
        //
        // String.prototype.__ = async function (jsonRow: {} = undefined): string {
        //     //.then(({ FileDataBank }) => {
        //     let rtrn: string = this as string;
        //     if (jsonRow != undefined)
        //         rtrn = jqFeatures.regsMng.parse(jsonRow, rtrn);
        //     return FileDataBank.getReplacedContent(rtrn);
        //     // });
        // };
        Extensions.isInited = true;
        console.log('EXTENSION inited...');
    }
    static doCommonDomProto(commonPrototype) {
        commonPrototype["#data"] = function (key, value) {
            switch (arguments.length) {
                case 0:
                    return Extensions.data.getData(this);
                    break;
                case 1:
                    switch (typeof key) {
                        case "string": return Extensions.data.getData(this, key);
                        case "object": Extensions.data.getData(this, key);
                    }
                    break;
                case 2:
                    Extensions.data.setData(this, key, value);
                    break;
            }
        };
    }
}
/**
 * Produces a function which uses template strings to do simple interpolation from objects.
 *
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
 *
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 
var generateTemplateString = (function () {
    var cache = {};

    function generateTemplate(template) {
        var fn = cache[template];

        if (!fn) {
            // Replace ${expressions} (etc) with ${map.expressions}.

            var sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
                    return `\$\{map.${match.trim()}\}`;
                })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            fn = Function('map', `return \`${sanitized}\``);
        }

        return fn;
    }

    return generateTemplate;
})();
*/ 
//# sourceMappingURL=Extensions.js.map