import { ITptOptions, IUcOptions, objectOpt, UcOptions } from "../common/enumAndMore.js";

import { CssVariableHandler, VariableList } from "./StylerRegs.js";
import { Template } from "./Template.js";
import { Usercontrol } from "./Usercontrol.js";

export class intenseGenerator {

    static generateUC<T = string>(/*path: T,*/ classObj: any,/* importMetaURL: string,*/ pera: IUcOptions, ...args: any[]): Usercontrol {
        const param0: IUcOptions = objectOpt.copyProps(pera, UcOptions);

        const toSend = [];
        toSend.push(...args, param0);
        const uc: Usercontrol = (new (classObj)(...toSend));
        uc['initializecomponent'](param0, uc);
        if (uc['$']) uc['$'](...args);
        return uc;
    }
    static async generateUCAsync<T = string>(/*path: T,*/ classObj: any,/* importMetaURL: string,*/ pera: IUcOptions, ...args: any[]): Promise<Usercontrol> {
        let param0: IUcOptions = objectOpt.copyProps(pera, UcOptions);


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
    static generateTPT(classObj: any, pera: ITptOptions, ...args: any[]): Template {
        let param0: ITptOptions = Object.assign(new ITptOptions(), pera);

        //  param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        let uc: Template = (new (classObj)());
        // uc.extended.initializebase(param0);
        uc['initializecomponent'](param0);
        if (uc['$']) uc['$'](...args);
        return uc;
    }
    static async generateTPTAsync(classObj: any, pera: ITptOptions, ...args: any[]): Promise<any> {
        let param0: ITptOptions = Object.assign(new ITptOptions(), pera);
        //  param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        args.push(param0);
        let uc: Template = (new (classObj)());
        // uc.extended.initializebase(param0);
        await uc['initializecomponentAsync'](param0);
        if (uc['$']) await uc['$'](...args);
        return uc;
    }
}
