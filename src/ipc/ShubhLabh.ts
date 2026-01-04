export class RendererProcess {
  static isRegistered = false;
  static async init() {
    if (this.isRegistered) return;
    this.isRegistered = true;
    const { IPC_API_KEY } = await import('./enumAndMore.js');
    const { IpcRendererHelper } = await import('./IpcRendererHelper.js');
    IpcRendererHelper.init(window);


    
    const { nodeFn } = await import('../nodeFn.js');
    nodeFn.fullfill = window[IPC_API_KEY].fullFill;

    
    const { ProjectManage } = await import('./ProjectManage.js');
    ProjectManage.init();


    const { PathBridge } = await import('../build/pathBridge.js');
    PathBridge.path = nodeFn.path;
    PathBridge.url = nodeFn.url;
    PathBridge.source = ProjectManage.projects;
    //ProjectManage.getInfo();
    const { TabIndexManager } = await import("../lib/TabIndexManager.js");
    TabIndexManager.init();

    const { Extensions } = await import('../lib/Extensions.js');
    Extensions.init();

    const { StylerRegs } = await import('../StylerRegs.js');
    StylerRegs.initProjectsStyle();

    const { builder } = await import('../build/builder.js');
    let mgen = builder.GetInstance();

    const { WinManager } = await import('../lib/WinManager.js');
    WinManager.initEvent();

    PathBridge.CheckAndSetDefault();

    const keyBinding = ProjectManage.getInfoByProjectPath(ProjectManage.PROJECT_PATH).config.developer.build.keyBind ?? [];

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
    /*
   (await import('<?=initialPreload?>'));


   (await import('<?=initailModule?>'));
   */

  }
} 
