import { Usercontrol } from "../../../renderer/Usercontrol.js";
import { intenseGenerator } from "../../../renderer/intenseGenerator.js";
import { IUcOptions } from "../../../common/enumAndMore.js";
import { VariableList } from "../../../renderer/StylerRegs.js";
import { ucWinFrame } from "../../../renderer/controls/ucWinFrame.uc.js";
import { sampleForm } from "../../../renderer/controls/sampleForm.uc.js";

import sampleForm$dynamicHtmlCode from "../../../renderer/controls/sampleForm.uc.html.js";   


const FILE_PATH = '../../../htmlFiles/renderer/controls/sampleForm.uc.html';  
export class sampleForm$Designer extends Usercontrol {    
    public static get FILE_PATH() {
        return FILE_PATH;
    }
    public static get AbsolutePath() {
        return import.meta.url;//Usercontrol.Resolver(import.meta.url, this.FILE_PATH);
    }
     
    static setCSS_globalVar (varList:VariableList): void  {
        intenseGenerator.setCSS_globalVar(varList,this.FILE_PATH);
    }   
    static Create(pera: IUcOptions, ...args: any[]): sampleForm {  
        return intenseGenerator.generateUC(this.FILE_PATH,sampleForm,import.meta.url,pera,...args) as sampleForm;
    }
    static async CreateAsync(pera: IUcOptions, ...args: any[]): Promise<sampleForm> {
        return (await intenseGenerator.generateUCAsync( this.FILE_PATH, sampleForm, import.meta.url, pera, ...args)) as sampleForm;
    }
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }

    public winframe1: import('../../../renderer/controls/ucWinFrame.uc.js').ucWinFrame;
    
    
    constructor(){ super(); }

    async initializecomponentAsync(args: IUcOptions, form: sampleForm) {
        let ucExt = this.ucExtends;
        
        args.source.htmlContents = args?.source?.htmlContents ?? sampleForm$dynamicHtmlCode?.htmlSource() ?? undefined;
        
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

    initializecomponent(args: IUcOptions, form: sampleForm) {        
        let ucExt = this.ucExtends;
        
        args.source.htmlContents = args?.source?.htmlContents ?? sampleForm$dynamicHtmlCode?.htmlSource() ?? undefined;
        
        ucExt.initializecomponent(args);          
        let CONTROLS = ucExt.controls;
        
        this.winframe1 = ucWinFrame.Create({ 
                parentUc : this, 
                mode:args.mode,
                accessName:"winframe1" , 
                targetElement : CONTROLS.winframe1 as any
            });
        this.winframe1.ucExtends.show({decision : 'replace'});

        
        if(args.events?.beforeFinalize!=undefined) args.events?.beforeFinalize(form);
        ucExt.finalizeInit(args);        
        delete this.initializecomponent; 
        delete this.initializecomponentAsync;
        delete ucExt.initializecomponent;
        delete ucExt.finalizeInit;
        delete ucExt.finalizeInitAsync;
    }
}