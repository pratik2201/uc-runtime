
import { IPC_API_KEY } from "../../common/ipc/enumAndMore.js";
import { Extensions } from "../../lib/Extensions.js";
import { SourceNode } from "../../lib/StampGenerator.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { AssemblyManager, Assembly } from "../../renderer/Assembly.js";
import { IpcRendererHelper } from "../../renderer/ipc/IpcRendererHelper.js";
import { nodeFn } from "../../renderer/nodeFn.js";
import { ResourceManage } from "../../renderer/ResourceManage.js";
import { StyleBaseType, StylerRegs } from "../../renderer/StylerRegs.js";
let isExecuted = false;
async function initRenderer() {
  if (isExecuted) return;
  isExecuted = true;
  IpcRendererHelper.init(window);
  nodeFn.fullfill = window[IPC_API_KEY].fullFill;

  TabIndexManager.init();
  Extensions.init();
  SourceNode.init();
  const _assembiles = IpcRendererHelper.assemblies;
  AssemblyManager.assemblies = {} as any;
  for (const [k, v] of Object.entries(_assembiles)) {
    const _newAssembly = new Assembly();
    Object.assign(_newAssembly, v);
    AssemblyManager.assemblies[k] = _newAssembly;
    _newAssembly.defaultLoadAt = document.body;
    _newAssembly.srcNode = SourceNode.registerSource({
      key: _newAssembly.cssGuid,
      baseType: StyleBaseType.Global,
      assembly: _newAssembly,
      mode: '$',
      accessName: _newAssembly.name,
    });
    _newAssembly.srcNode.pushCSS(_newAssembly.cssGuid, ResourceManage.getContent(_newAssembly.cssGuid), document.body);
  }
  WinManager.initEvent();
  console.log('All Done... ');
}
await initRenderer();



// function getImportMap() {
//   const script = document.querySelector(
//     'script[type="importmap"]'
//   ) as HTMLScriptElement | null;
//   if (!script?.textContent) {
//     throw new Error("ImportMapResolver: importmap script not found");
//   }
//   return JSON.parse(script.textContent);
// }