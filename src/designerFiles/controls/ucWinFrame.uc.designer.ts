 import { Usercontrol,intenseGenerator,IUcOptions } from "../../core.js";
 import { ucWinFrame } from "../../controls/ucWinFrame.uc.js";


export class ucWinFrame$Designer extends Usercontrol {    
    
    get(id:"") {
        return this.ucExtends.find(`[id="${id}"]`)[0];
    }
    public titlebar1!: HTMLElement;
    public lbl_title!: HTMLElement;
    public cmd_close!: HTMLElement;
    public container1!: HTMLElement;
    
    
    constructor(){ super(); }

    

    static Create(pera: IUcOptions, ...args: any[]) {
       return ( intenseGenerator.generateUC(ucWinFrame,  pera, ...args)) as ucWinFrame;
    }

    initializecomponent?(args: IUcOptions, form: ucWinFrame){
        const ucExt = this.ucExtends;
        args.guid = "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000003" as never;
        
        ucExt.initializecomponent(args);                
        const CONTROLS = ucExt.controls; 

        
        this.titlebar1 = CONTROLS.titlebar1  as unknown as HTMLElement;
        this.lbl_title = CONTROLS.lbl_title  as unknown as HTMLElement;
        this.cmd_close = CONTROLS.cmd_close  as unknown as HTMLElement;
        this.container1 = CONTROLS.container1  as unknown as HTMLElement;

        if(args.events?.beforeFinalize!=undefined) args.events?.beforeFinalize(form);
        ucExt.finalizeInit(args);        
        delete this.initializecomponent; 
        delete this.initializecomponentAsync; 
        ucExt.takeoff();
    }



    static  async CreateAsync(pera: IUcOptions, ...args: any[]) {
       return ( await  intenseGenerator.generateUCAsync(ucWinFrame,  pera, ...args)) as ucWinFrame;
    }

     async initializecomponentAsync?(args: IUcOptions, form: ucWinFrame){
        const ucExt = this.ucExtends;
        args.guid = "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000003" as never;
        
        ucExt.initializecomponent(args);                
        const CONTROLS = ucExt.controls; 

        
        this.titlebar1 = CONTROLS.titlebar1  as unknown as HTMLElement;
        this.lbl_title = CONTROLS.lbl_title  as unknown as HTMLElement;
        this.cmd_close = CONTROLS.cmd_close  as unknown as HTMLElement;
        this.container1 = CONTROLS.container1  as unknown as HTMLElement;

        if(args.events?.beforeFinalize!=undefined) args.events?.beforeFinalize(form);
        ucExt.finalizeInit(args);        
        delete this.initializecomponent; 
        delete this.initializecomponentAsync; 
        ucExt.takeoff();
    }


}

