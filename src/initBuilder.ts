
import { ProjectManage } from "ucbuilder-devtools/out/renderer/ProjectManage.js";
import { WinManager } from "./lib/WinManager.js";
import { nodeFn } from "./renderer/nodeFn.js";
import { PathBridge } from "ap-shared-core/out/ucbuilder-devtools/pathBridge.js";

async function initBuilder() {
    ProjectManage.init();
    PathBridge.path = nodeFn.path as any;
    PathBridge.url = nodeFn.url  as any;
    PathBridge.CheckAndSetDefault();
    PathBridge.source = ProjectManage.projects;
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
}
await initBuilder();