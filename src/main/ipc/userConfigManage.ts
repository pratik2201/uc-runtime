import { pathToFileURL } from "node:url";
import { deepAssign, GetProjectName, IBuildDirectory, IFileDeclaration, UcBuildOptions, UserUCConfig } from "../../common/ipc/enumAndMore.js";
import path from "node:path";
import fs from "node:fs";
import { existsSync, fstat } from "node:fs";
export async function GetUcConfig(projectdir: string): Promise<UserUCConfig> {
    let config_file_path = path.join(projectdir, 'ucconfig.js');
    if (existsSync(config_file_path)) {
        return await ImportUserConfig(config_file_path); //JSON.parse(fs.readFileSync(config_file_path, 'binary'));
    }
    return undefined;
}
export default function UcDefaultConfig<K = IBuildDirectory>(...cfg: Partial<UserUCConfig<K>>[]) {
    let rtrn = new UserUCConfig<K>();
    //console.log(rtrn);    
    deepAssign(rtrn, ...cfg);
    // console.log(rtrn);


    return rtrn;
}
export async function ImportUserConfig(fpath: string): Promise<UserUCConfig> {
    //console.log(fpath);
    if (!fpath.startsWith('file:/')) fpath = pathToFileURL(fpath).href;
    try {
        let res = (await import(fpath));
        let rtrn = res?.default;
        checkUc(rtrn, fpath);
        return rtrn;
    } catch (e) {
        console.log(e);
    }
}
function checkUc(cfg: UserUCConfig, filePath: string) {
    if (cfg == undefined) throw new Error('EMPTY CONFIG');
    const pref = cfg?.preference;
    let dirDeclaration = pref?.dirDeclaration;
    if (dirDeclaration != undefined) {
        const fileWisePath = pref.fileWisePath;
        if (fileWisePath != undefined) {
            for (const [srcType, fileDec] of Object.entries(fileWisePath)) {
                for (const dirDec of Object.values(pref?.dirDeclaration)) {
                    dirDec.fileWisePath = dirDec.fileWisePath ?? {};
                    dirDec.fileWisePath[srcType] = dirDec.fileWisePath[srcType] ?? {};
                    const fd = dirDec.fileWisePath[srcType] as IFileDeclaration;
                    fd.dirPath = fd.dirPath ?? fileDec.dirPath ?? '';
                    fd.extension = fd.extension ?? fileDec.extension ?? '';
                }
            }
        }
    }
    pref.build = pref.build ?? new UcBuildOptions();

    const prjName = GetProjectName(filePath, path, fs);

    /*cfg.browser = cfg.browser ?? {  importmap: {} };
    const prjName = GetProjectName(filePath, path, fs);
    let importMap = cfg.browser.importmap = {};
    if (importMap['ucbuilder'] == undefined) {
        importMap['ucbuilder'] = prjName == 'ucbuilder' ? "." : "node_modules/ucbuilder";
    }
    cfg.browser.importmap = importMap;*/
    if (cfg.browser.importmap['ucbuilder'] == undefined) {
        cfg.browser = cfg.browser ?? { importmap: {} };
        cfg.browser.importmap = cfg.browser.importmap ?? {};
        cfg.browser.importmap.ucbuilder = cfg.browser.importmap.ucbuilder = (prjName == 'ucbuilder' ? "." : "node_modules/ucbuilder");
    }


    // "ucbuilder": "node_modules/ucbuilder",  
}