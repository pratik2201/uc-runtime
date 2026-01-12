import { builder } from "../../build/builder.js";
import { PathBridge } from "../../build/pathBridge.js";
import { Extensions } from "../../lib/Extensions.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { nodeFn } from "../../nodeFn.js";
import { StylerRegs } from "../../StylerRegs.js";
import { IPC_API_KEY } from "../../common/ipc/enumAndMore.js";
import { IpcRendererHelper } from "./IpcRendererHelper.js";
import { ProjectManage } from "./ProjectManage.js";
let isExecuted = false;
export function initRenderer() {
  if (isExecuted) return;
  isExecuted = true;
  IpcRendererHelper.init(window);
  nodeFn.fullfill = window[IPC_API_KEY].fullFill;
  ProjectManage.init();
  PathBridge.path = nodeFn.path;
  PathBridge.url = nodeFn.url;
  PathBridge.CheckAndSetDefault();
  PathBridge.source = ProjectManage.projects;
  TabIndexManager.init();
  Extensions.init();
  StylerRegs.initProjectsStyle();
  let mgen = builder.GetInstance();
  WinManager.initEvent();
  const keyBinding = ProjectManage.getInfoByProjectPath(ProjectManage.PROJECT_PATH).config.preference.build.keyBind ?? ['ControlRight', 'F12'];
  const shortcutKeys = [keyBinding];
  let hasCaptured = false;
  //mgen.filewatcher.startWatch();
  window['$ucbuilder'] = mgen;
  //console.log(WinManager.sortcutMng);
  const scLater = WinManager.shortcutManage.CreateLayer();
  scLater.register(shortcutKeys, (e) => {
    (async () => {
      console.log('BUILDING...');
      //await mgen.filewatcher.stopWatch();
      await mgen.buildALL(() => {
        console.log('BUILD SUCCESSFULL...');
        //mgen.filewatcher.startWatch();
      }, false);
    })();
  });
  console.log('All Done... ');
}
initRenderer();