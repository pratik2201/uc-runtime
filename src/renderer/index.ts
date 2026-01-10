
import { RendererProcess } from "../initUC.js";
import { sampleForm } from "./controls/sampleForm.uc.js";
(async () => {
    console.log('LOADED..');
    await RendererProcess.init();
    debugger;
    const frm = await sampleForm.CreateAsync({ targetElement: document.body });
    await frm.ucExtends.showDialog();
})(); 