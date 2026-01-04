import { pathToFileURL } from "node:url";
import { deepAssign, IFileDeclaration, UserUCConfig } from "./enumAndMore.js";
import path from "node:path";
import { existsSync } from "node:fs";
export async function GetUcConfig(projectdir: string): Promise<UserUCConfig> {
    let config_file_path = path.join(projectdir, 'ucconfig.js');
    if (existsSync(config_file_path)) {
        return await ImportUserConfig(config_file_path); //JSON.parse(fs.readFileSync(config_file_path, 'binary'));
    }
    return undefined;
}
export default function UcDefaultConfig(...cfg: Partial<UserUCConfig>[]) {
    let rtrn = new UserUCConfig();
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
        checkUc(rtrn);
        return rtrn;
    } catch (e) {
        console.log(e);
    }
}
function checkUc(cfg: UserUCConfig) {
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

}