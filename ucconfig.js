import UcDefaultConfig from "./out/ipc/userConfigManage.js";
export default UcDefaultConfig({
    exports: "import",
    projectBaseCssPath: "styles.scss",
    browser: {
        importmap: {
            "@ucbuilder": "out"
        }
    }, 
    preference: {
        dirDeclaration: {
            src: {
                dirPath: 'src',
                fileWisePath: {
                    code: { dirPath: '', extension: '.ts' },
                    scss: { dirPath: '', extension: '.scss' },
                    designer: { dirPath: '', extension: '.designer.ts' },
                    html: { dirPath: '', extension: '.html' }
                }
            },
            out: {
                dirPath: 'out',
                fileWisePath: {
                    code: { dirPath: '', extension: '.js' },
                    designer: { dirPath: '', extension: '.designer.js' },
                }
            }
        },
        outDir: "out",
        srcDir: "src",
    },
    type: "ts",
    preloadMain: [
        "{:out/build/fileWatcher.ipc.js}",
        "{:out/nodeFn.ipc.js}"
    ]
});