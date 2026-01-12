import { sampleForm } from "./controls/sampleForm.uc.js";
const frm = await sampleForm.CreateAsync({ targetElement: document.body });
await frm.ucExtends.showDialog();