
import { IPC_API_KEY } from "../../common/ipc/enumAndMore.js";
import { Extensions } from "../../lib/Extensions.js";
import { SourceNode } from "../../lib/StampGenerator.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { IpcRendererHelper } from "../../renderer/ipc/IpcRendererHelper.js";
import { nodeFn } from "../../renderer/nodeFn.js";
import { ResourceManage } from "../../renderer/ResourceManage.js";
import { StyleBaseType, StylerRegs } from "../../renderer/StylerRegs.js";
import { Assembly, AssemblyManager } from "../Assembly.js";
import { ImportMapResolver } from "ap-shared-core/out/ucbuilder-devtools/ImportMapResolver.js";

let isExecuted = false;
function getImportMap() {
  const script = document.querySelector(
    'script[type="importmap"]'
  ) as HTMLScriptElement | null;

  if (!script?.textContent) {
    throw new Error("ImportMapResolver: importmap script not found");
  }

  return JSON.parse(script.textContent);
}
async function initRenderer() {
  if (isExecuted) return;
  isExecuted = true;
  IpcRendererHelper.init(window);
  nodeFn.fullfill = window[IPC_API_KEY].fullFill;
  ImportMapResolver.init(getImportMap(), nodeFn.path.resolve());

  TabIndexManager.init();
  Extensions.init();
  StylerRegs.initProjectsStyle();
  const _assembiles = IpcRendererHelper.assemblies;
  AssemblyManager.assemblies = {};
  for (const [k, v] of Object.entries(_assembiles)) {
    const _newAssembly = new Assembly();
    Object.assign(_newAssembly, v);
    AssemblyManager.assemblies[k] = _newAssembly;
    _newAssembly.defaultLoadAt = document.body;
    _newAssembly.srcNode = SourceNode.registerSource({
      key: _newAssembly.cssGuid,
      baseType: StyleBaseType.Global,
      assembly: _newAssembly,
      //project: undefined,
      mode: '$',
      accessName: _newAssembly.name,
    });
    _newAssembly.srcNode.pushCSS(_newAssembly.cssGuid, ResourceManage.getContent(_newAssembly.cssGuid), document.body);
  }
  //console.log(AssemblyManager.assemblies);

  WinManager.initEvent();

  console.log('All Done... ');
}
await initRenderer();