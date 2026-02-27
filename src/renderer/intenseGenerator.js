import { ITptOptions, objectOpt, UcOptions } from "../common/enumAndMore.js";
export class intenseGenerator {
    static generateUC(/*path: T,*/ classObj, /* importMetaURL: string,*/ pera, ...args) {
        const param0 = objectOpt.copyProps(pera, UcOptions);
        const toSend = [];
        toSend.push(...args, param0);
        const uc = (new (classObj)(...toSend));
        uc['initializecomponent'](param0, uc);
        if (uc['$'])
            uc['$'](...args);
        return uc;
    }
    static async generateUCAsync(/*path: T,*/ classObj, /* importMetaURL: string,*/ pera, ...args) {
        let param0 = objectOpt.copyProps(pera, UcOptions);
        let toSend = [];
        toSend.push(...args, param0);
        let uc = (new (classObj)(...toSend));
        await uc['initializecomponentAsync'](param0, uc);
        if (param0.events.afterInitlize != undefined)
            await param0.events.afterInitlize(uc);
        if (uc['$'])
            await uc['$'](...args);
        return uc;
    }
    static GetResource = (guid) => {
        const rtrn = { htmlFile: undefined, cssFile: undefined };
        //  rtrn.htmlFile = nodeFn.resource.getResource(`html-${guid}`, 'htmlFile');
        return rtrn;
    };
    static generateTPT(classObj, pera, ...args) {
        let param0 = Object.assign(new ITptOptions(), pera);
        //  param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        let uc = (new (classObj)());
        // uc.extended.initializebase(param0);
        uc['initializecomponent'](param0);
        if (uc['$'])
            uc['$'](...args);
        return uc;
    }
    static async generateTPTAsync(classObj, pera, ...args) {
        let param0 = Object.assign(new ITptOptions(), pera);
        //  param0.cfInfo.parseUrl(path, 'out', callerMetaUrl);
        args.push(param0);
        let uc = (new (classObj)());
        // uc.extended.initializebase(param0);
        await uc['initializecomponentAsync'](param0);
        if (uc['$'])
            await uc['$'](...args);
        return uc;
    }
}
//# sourceMappingURL=intenseGenerator.js.map