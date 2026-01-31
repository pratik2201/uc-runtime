import { ITptOptions, IUcOptions, objectOpt, TptOptions, UcOptions } from "../common/enumAndMore.js";
import { GetProject } from "../common/ipc/enumAndMore.js";
import { codeFileInfo, GetDeclaration } from "../global/codeFileInfo.js";
import { PathBridge } from "../global/pathBridge.js";
import { nodeFn } from "./nodeFn.js";
import { CssVariableHandler, VariableList } from "./StylerRegs.js";
import { Template } from "./Template.js";
import { Usercontrol } from "./Usercontrol.js";

export class intenseGenerator {
    static setCSS_globalVar(varList: VariableList, _path: string): void {
        let rt = GetDeclaration(_path);//ProjectManage.getInfo(_path, getMetaUrl(_path, ProjectManage.projects));
        //console.log(rt);

        CssVariableHandler.SetCSSVarValue(varList, '' + rt.project['id'], 'g');
    }
    static generateUC<T = string>(path: T, classObj: any, importMetaURL: string, pera: IUcOptions, ...args: any[]): Usercontrol {
        const param0: IUcOptions = objectOpt.copyProps(pera, UcOptions);
        ///console.log(path);

        const prj = GetProject((importMetaURL ?? path) as any, PathBridge.source, nodeFn.url as any);
        const pref = prj.config.preference;
        if (param0.cfInfo == undefined) {
            param0.cfInfo = new codeFileInfo();
            param0.cfInfo.parseUrl(path as string, pref.outDir as any, importMetaURL);
        }
        const toSend = [];
        toSend.push(...args, param0);
        const uc: Usercontrol = (new (classObj)(...toSend));
        uc['initializecomponent'](param0, uc);
        if (uc['$']) uc['$'](...args);
        return uc;
    }
    static async generateUCAsync<T = string>(path: T, classObj: any, importMetaURL: string, pera: IUcOptions, ...args: any[]): Promise<Usercontrol> {
        let param0: IUcOptions = objectOpt.copyProps(pera, UcOptions);
        // console.log(path);
        // debugger;
        const prj = GetProject((importMetaURL ?? path) as any, PathBridge.source, nodeFn.url as any);
        const pref = prj.config.preference;
        if (param0.cfInfo == undefined) {
            param0.cfInfo = new codeFileInfo();
            param0.cfInfo.parseUrl(path as string, pref.outDir as any, importMetaURL);
        }
        let toSend = [];
        toSend.push(...args, param0);
        let uc: Usercontrol = (new (classObj)(...toSend));
        await uc['initializecomponentAsync'](param0, uc);
        if (param0.events.afterInitlize != undefined)
            await param0.events.afterInitlize(uc);

        if (uc['$']) await uc['$'](...args);

        return uc;
    }
    static GetResource = (guid: string) => {
        const rtrn: { htmlFile: string, cssFile: string } = { htmlFile: undefined, cssFile: undefined };
      //  rtrn.htmlFile = nodeFn.resource.getResource(`html-${guid}`, 'htmlFile');
        return rtrn;
    }
    static generateTPT(path: string, classObj: any, callerMetaUrl: string, pera: ITptOptions, ...args: any[]): Template {
        let param0: ITptOptions = objectOpt.copyProps(pera, TptOptions);
        param0.cfInfo = new codeFileInfo();
        param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        let uc: Template = (new (classObj)());
        uc.extended.initializebase(param0);
        uc['initializecomponent'](param0);
        if (uc['$']) uc['$'](...args);
        return uc;
    }
    static async generateTPTAsync(path: string, classObj: any, callerMetaUrl: string, pera: ITptOptions, ...args: any[]): Promise<any> {
        let param0: ITptOptions = Object.assign(pera, TptOptions);
        param0.cfInfo = new codeFileInfo();
        param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        args.push(param0);
        let uc: Template = (new (classObj)());
        uc.extended.initializebase(param0);
        await uc['initializecomponentAsync'](param0);
        if (uc['$']) await uc['$'](...args);
        return uc;
    }
}
