import { ucUtil } from "./ucUtil.js";
import { nodeFn } from "../renderer/nodeFn.js";
function randomNo(min = 0, max = 1000000) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}
const RuntimeKEY = 'TMaker' + randomNo();
export class TemplateMaker {
    mainImportMeta;
    templateCache = new Map();
    constructor(mainImportMeta) {
        this.mainImportMeta = mainImportMeta;
    }
    loadTemplate(filepath) {
        filepath = ucUtil.devEsc(filepath);
        return nodeFn.fs.readFileSync(filepath); /// path.resolve(this.baseDir, filepath), 'utf-8'
    }
    compileTemplate(template /*, filePath = ''*/) {
        if (this.templateCache.has(template))
            return this.templateCache.get(template);
        let _this = this;
        // debugger;
        // let output = []; let $$$=context; with (context) {\n`;
        let incCode = '';
        let fileCodeDict = new Map();
        let _COUNTER = 0;
        let jsCode = ` with (this) {\n`;
        // let includedFiles: string[] = [];
        // let ksCode: string[] = [];
        const regex = /([\s\S]*?)(<\?php|<\?=|<\?)([\s\S]*?)\?>/g;
        function tptbind(tptc, imprtmta) {
            let _code = '';
            let lastIndex = 0;
            tptc.replace(regex, (match, staticText, tag, code, offset) => {
                if (staticText?.trim()) {
                    _code += `output.push(${JSON.stringify(staticText)});\n`;
                }
                let codeTrimmed = code.trim();
                if (tag === "<?=") {
                    _code += `try { output.push(${codeTrimmed}); } catch (e) { output.push(undefined); }\n`;
                }
                else {
                    //  /\binclude\s*\(?['"](.+?)['"]\)?\s*;/gm
                    codeTrimmed = codeTrimmed.replace(/\binclude\s*([\"'`])((?:\\.|(?!\2)[^\\])*)\2\s*;/gm, (match, includePath) => {
                        console.log('TEMPLATE MAKER');
                        let fpath = nodeFn.path.resolveFilePath(imprtmta, includePath);
                        let funcName = fileCodeDict.get(fpath);
                        if (funcName !== undefined) {
                            return funcName + ';';
                        }
                        else {
                            let ltpt = _this.loadTemplate(includePath);
                            let fcodes = tptbind(ltpt, imprtmta /* ltpt.info.project.importMetaURL*/);
                            funcName = RuntimeKEY + "_" + (_COUNTER++);
                            incCode += `const ${funcName} = ${fcodes};`;
                            fileCodeDict.set(fpath, funcName);
                            return funcName + ';';
                        }
                    });
                    _code += `${codeTrimmed}\n`;
                }
                lastIndex = offset + match.length;
                return match;
            });
            if (lastIndex < tptc.length) {
                _code += `output.push(${JSON.stringify(tptc.slice(lastIndex))});\n`;
            }
            return _code;
        }
        jsCode += tptbind(template, _this.mainImportMeta);
        jsCode += `\n} // end with`;
        jsCode = incCode + ' ' + jsCode;
        let renderFn;
        try {
            renderFn = new Function('output', jsCode);
        }
        catch (ex) {
            console.log(jsCode);
            console.log(ex);
        }
        const finalFn = (ctx = {}) => {
            const output = [];
            renderFn.call(ctx, output);
            //renderFn(ctx, /*include,*/ output);
            return output.join('').replace(/&nbsp;/g, ' ');
        };
        this.templateCache.set(template, finalFn);
        return finalFn;
    }
}
//# sourceMappingURL=TemplateMaker.js.map