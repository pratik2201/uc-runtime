import UcDefaultConfig from "./out/main/ipc/userConfigManage.js";
export default UcDefaultConfig({ 
    preference: {
        build: {
            RuntimeResources: [
                {
                    includeExtensions: [".html", ".scss", ".mjs", ".css", ".svg", ".png", ".jpg", ".ico"],
                    fromDeclare: "src",
                    toDeclares: ["out"]
                }
            ]
        },
        dirDeclaration: {
            src: {
                dirPath: 'src',
                fileWisePath: {
                    code: { extension: '.ts' },
                    designer: { extension: '.designer.ts' },
                    dynamicDesign: { extension: '.html.ts' }
                }
            },
            out: {
                dirPath: 'out',
                fileWisePath: {
                    code: { extension: '.js' },
                    designer: { extension: '.designer.js' },
                    dynamicDesign: { extension: '.html.js' },
                }
            }
        },
        fileWisePath: {
            code: { dirPath: '' },
            dynamicDesign: { dirPath: '' },
            designer: { dirPath: 'designerFiles' },
            scss: { dirPath: '', extension: '.scss' },
            html: { dirPath: 'htmlFiles', extension: '.html' },
        },
        outDir: "out",
        srcDir: "src",
    },
});