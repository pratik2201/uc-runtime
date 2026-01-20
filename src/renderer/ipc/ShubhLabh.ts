
import { PathBridge } from "../../global/pathBridge.js";
import { Extensions } from "../../lib/Extensions.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { StylerRegs } from "../StylerRegs.js";
import { IPC_API_KEY } from "../../common/ipc/enumAndMore.js";
import { IpcRendererHelper } from "./IpcRendererHelper.js";
import { ProjectManage } from "./ProjectManage.js";
import { nodeFn } from "../nodeFn.js";
let isExecuted = false;
export async function initRenderer() {
  if (isExecuted) return;
  isExecuted = true;
  IpcRendererHelper.init(window);
  nodeFn.fullfill = window[IPC_API_KEY].fullFill;
  //nodeFn.fullfill = window[IPC_API_KEY].fullFill;
  ProjectManage.init();
  PathBridge.path = nodeFn.path;
  PathBridge.url = nodeFn.url;
  PathBridge.CheckAndSetDefault();
  PathBridge.source = ProjectManage.projects;
  TabIndexManager.init();
  Extensions.init();
  StylerRegs.initProjectsStyle();


  WinManager.initEvent();

  try {
    
    const keyBinding = ProjectManage.getInfoByProjectPath(ProjectManage.PROJECT_PATH).config.preference.build.keyBind ?? ['ControlRight', 'F12'];
    const shortcutKeys = [keyBinding];

    const { builder } = await import("ucbuilder-devtools/out/renderer/builder.js");
    let mgen = builder.GetInstance();
    window['$ucbuilder'] = mgen;
    const scLater = WinManager.shortcutManage.CreateLayer();
    scLater.register(shortcutKeys, (e) => {
      (async () => {
        console.log('BUILDING...');
        await mgen.buildALL(() => {
          console.log('BUILD SUCCESSFULL...');
        }, false);
      })();
    });
    
  } catch (ex) {
    // Devtools not installed or failed to load
    console.warn("ucbuilder: devtools not available.");
    console.log(ex);

  }
  console.log('All Done... ');
}
await initRenderer();