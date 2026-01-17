import { Usercontrol } from "../../../renderer/Usercontrol.js";
import { intenseGenerator } from "../../../renderer/intenseGenerator.js";
import { IUcOptions } from "../../../common/enumAndMore.js";
import { VariableList } from "../../../renderer/StylerRegs.js";
import { ucWinFrame } from "../../../renderer/controls/ucWinFrame.uc.js";

import ucWinFrame$dynamicHtmlCode from "../../../renderer/controls/ucWinFrame.uc.html.js";   


const FILE_PATH = '../../../htmlFiles/renderer/controls/ucWinFrame.uc.html';  
export class ucWinFrame$Designer extends Usercontrol {    
    public static get FILE_PATH() {
        return FILE_PATH;
    }
    public static get AbsolutePath() {
        return import.meta.url;//Usercontrol.Resolver(import.meta.url, this.FILE_PATH);
    }
     
    static setCSS_globalVar (varList:VariableList): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }   
    static Create(pera: IUcOptions, ...args: any[]): ucWinFrame {  
        return intenseGenerator.generateUC(this.FILE_PATH,ucWinFrame,import.meta.url,pera,...args) as ucWinFrame;
    }
    static async CreateAsync(pera: IUcOptions, ...args: any[]): Promise<ucWinFrame> {
        return (await intenseGenerator.generateUCAsync( this.FILE_PATH, ucWinFrame, import.meta.url, pera, ...args)) as ucWinFrame;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }

    public titlebar1: HTMLElement;
    public lbl_title: HTMLElement;
    public cmd_close: HTMLElement;
    public container1: HTMLUnknownElement;
    
    
    constructor(){ super(); }

    async initializecomponentAsync(args: IUcOptions, form: ucWinFrame) {
        let ucExt = this.ucExtends;
        
        args.source.htmlContents = args?.source?.htmlContents ?? ucWinFrame$dynamicHtmlCode?.htmlSource() ?? undefined;
        
        ucExt.initializecomponent(args);                
        let CONTROLS = ucExt.controls;
        
        await Usercontrol.GenerateControls(this,args,args.cfInfo.pathOf.code);
        
        if(args.events?.beforeFinalize!=undefined) args.events?.beforeFinalize(form);
        await ucExt.finalizeInitAsync(args);
                
        delete this.initializecomponent; 
        delete this.initializecomponentAsync; 
        delete ucExt.initializecomponent;
        delete ucExt.finalizeInit;
        delete ucExt.finalizeInitAsync;
    }

    initializecomponent(args: IUcOptions, form: ucWinFrame) {        
        let ucExt = this.ucExtends;
        
        args.source.htmlContents = args?.source?.htmlContents ?? ucWinFrame$dynamicHtmlCode?.htmlSource() ?? undefined;
        
        ucExt.initializecomponent(args);          
        let CONTROLS = ucExt.controls;
        
        this.titlebar1 = CONTROLS.titlebar1  as unknown as HTMLElement;
        this.lbl_title = CONTROLS.lbl_title  as unknown as HTMLElement;
        this.cmd_close = CONTROLS.cmd_close  as unknown as HTMLElement;
        this.container1 = CONTROLS.container1  as unknown as HTMLUnknownElement;

        
        if(args.events?.beforeFinalize!=undefined) args.events?.beforeFinalize(form);
        ucExt.finalizeInit(args);        
        delete this.initializecomponent; 
        delete this.initializecomponentAsync;
        delete ucExt.initializecomponent;
        delete ucExt.finalizeInit;
        delete ucExt.finalizeInitAsync;
    }
}