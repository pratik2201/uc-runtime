import path from "path";
import { defineConfig } from "vite";
const out = (p: string) => path.resolve(__dirname, 'src', p)
export default defineConfig({
  build: {
    lib: {
      entry: {
        'initUC': out('initUC.ts'),
        'ipc/IpcMainHelper': out('ipc/IpcMainHelper.ts'),
        'ipc/preload': out('ipc/preload.ts'),
        'build/regs/TemplateMaker': out('build/regs/TemplateMaker.ts'),
        'enumAndMore': out('enumAndMore.ts'),
        'nodeFn': out('nodeFn.ts'),
        'lib/TabIndexManager': out('lib/TabIndexManager.ts'),
        'build/pathBridge': out('build/pathBridge.ts'),
        'global/ucUtil': out('global/ucUtil.ts'),
        'StylerRegs': out('StylerRegs.ts'),
        'Template': out('Template.ts'),
        'Usercontrol': out('Usercontrol.ts'),
        'intenseGenerator': out('intenseGenerator.ts'),
        'build/fileWatcher': out('build/fileWatcher.ts'),
        'build/builder': out('build/builder.ts'),
        'global/commonEvent': out('global/commonEvent.ts'),
        'lib/hardware': out('lib/hardware.ts'),
        'ipc/enumAndMore': out('ipc/enumAndMore.ts'),
        'ipc/IpcRendererHelper': out('ipc/IpcRendererHelper.ts'),
        'build/codeFileInfo': out('build/codeFileInfo.ts'),
        'lib/WrapperHelper': out('lib/WrapperHelper.ts'),
        'lib/WinManager': out('lib/WinManager.ts'),
        'lib/SvgHelper': out('lib/SvgHelper.ts'),
        'global/runtimeOpt': out('global/runtimeOpt.ts'),
        'global/openCloser': out('global/openCloser.ts'),
        'ipc/ProjectManage': out('ipc/ProjectManage.ts'),
        'build/common': out('build/common.ts'),
        'lib/StampGenerator': out('lib/StampGenerator.ts'),
        'global/objectOpt': out('global/objectOpt.ts')
      },
      formats: ['es']
    },

    outDir: 'out',
    emptyOutDir: true,    
    rollupOptions: {
      external: [
        'electron',
        'node:fs',
        'node:path',
        'node:url',
        'node:stream'
      ],
      output: {
        entryFileNames: '[name].js',
        preserveModules: true
      }
    },
    ssr: true,
    target: 'esnext',
    minify: true
  }
});

/*import { defineConfig } from 'vite'
import path from 'node:path'

const out = (p: string) => path.resolve(__dirname, 'src', p)

export default defineConfig({
  build: {
    lib: {
      entry: {
        'initUC': out('initUC.ts'),
        'ipc/IpcMainHelper': out('ipc/IpcMainHelper.ts'),
        'ipc/preload': out('ipc/preload.ts'),
        'build/regs/TemplateMaker': out('build/regs/TemplateMaker.ts'),
        'enumAndMore': out('enumAndMore.ts'),
        'nodeFn': out('nodeFn.ts'),
        'lib/TabIndexManager': out('lib/TabIndexManager.ts'),
        'build/pathBridge': out('build/pathBridge.ts'),
        'global/ucUtil': out('global/ucUtil.ts'),
        'StylerRegs': out('StylerRegs.ts'),
        'Template': out('Template.ts'), 
        'Usercontrol': out('Usercontrol.ts'),
        'intenseGenerator': out('intenseGenerator.ts'),
        'build/fileWatcher': out('build/fileWatcher.ts'),
        'build/builder': out('build/builder.ts'),
        'global/commonEvent': out('global/commonEvent.ts'),
        'lib/hardware': out('lib/hardware.ts'),
        'ipc/enumAndMore': out('ipc/enumAndMore.ts'),
        'ipc/IpcRendererHelper': out('ipc/IpcRendererHelper.ts'),
        'build/codeFileInfo': out('build/codeFileInfo.ts'),
        'lib/WrapperHelper': out('lib/WrapperHelper.ts'),
        'lib/WinManager': out('lib/WinManager.ts'),
        'lib/SvgHelper': out('lib/SvgHelper.ts'),
        'global/runtimeOpt': out('global/runtimeOpt.ts'),
        'global/openCloser': out('global/openCloser.ts'),
        'ipc/ProjectManage': out('ipc/ProjectManage.ts'),
        'build/common': out('build/common.ts'),
        'lib/StampGenerator': out('lib/StampGenerator.ts'),
        'global/objectOpt': out('global/objectOpt.ts')
      },
      formats: ['es']
    },

    outDir: 'out',
    emptyOutDir: true,

    rollupOptions: {
      external: [
        'electron',
        'node:fs',
        'node:path',
        'node:url',
        'node:stream'
      ],
      output: {
        entryFileNames: '[name].js',
        preserveModules: false
      }
    },
    ssr: true,
    target: 'esnext',
    minify: true
  }
});*/

/*import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist/main',
    lib: {
      entry: 'src/exports/main.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {

      external: [
        'electron',
        "node:path",
        "node:url",
        "node:fs",
        "node:crypto"
      ],
    },

  },

});*/