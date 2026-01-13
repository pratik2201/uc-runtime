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
                fileDeclaration: {
                    code: { extension: '.ts' },
                    designer: { extension: '.designer.ts' },
                    dynamicDesign: { extension: '.html.ts' }
                }
            },
            out: {
                dirPath: 'out',
                fileDeclaration: {
                    code: { extension: '.js' },
                    designer: { extension: '.designer.js' },
                    dynamicDesign: { extension: '.html.js' },
                }
            }
        },
        fileCommonDeclaration: {
            designer: { subDirPath: 'designerFiles' },
            scss: { extension: '.scss' },
            html: { subDirPath: 'htmlFiles', extension: '.html' },
        },
        outDir: "out",
        srcDir: "src",
    },
});