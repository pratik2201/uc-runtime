import { Extensions } from "../../lib/Extensions.js";
import { ShortcutManager } from "../../lib/ShortcutManager.js";
import { ShortcutContext } from "../../lib/ShortcutCore.js";
import { SourceNode } from "../../lib/StampGenerator.js";
import { TabIndexManager } from "../../lib/TabIndexManager.js";
import { WinManager } from "../../lib/WinManager.js";
import { Assembly, AssemblyManager } from "../../renderer/Assembly.js";
import { IpcRendererHelper } from "../../renderer/ipc/IpcRendererHelper.js";
import { ResourceManage } from "../../renderer/ResourceManage.js";
import { StyleBaseType } from "../../renderer/StylerRegs.js";
let isExecuted = false;
export async function INIT_RENDERER() {
  if (isExecuted) return;
  ShortcutManager.ref = new ShortcutManager(ShortcutContext.globalRef);
  isExecuted = true;
  IpcRendererHelper.init(window);

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
      objectKey: _newAssembly.ProjectCSS,
      baseType: StyleBaseType.Global,
      assembly: _newAssembly,
      mode: '$',
      //accessName: _newAssembly.name as any,
    });
    _newAssembly.srcNode.AddCss(
      _newAssembly.ProjectCSS,
      ResourceManage.getContent(_newAssembly.ProjectCSS),
      document.body);
  }
  WinManager.initEvent();
  console.log('All Done... ');
}
