import { UcDefaultConfig } from "./out/core-main.js";
export default UcDefaultConfig({
    guid: "097DF085-D799-43EC-A783-CBFA4F228820",
    browser: {
        resolveProjects: ['ap-shared-core'],
        importmap: {},
        
    },
    preference: {
        build: {
            ResourceStorageFile: 'designerFiles/Resources.ts',
            RuntimeResources: [
                {
                    fromDeclare: 'src', toDeclares: ['out'],
                    includeExtensions: [".html", ".scss", ".mjs", ".css", ".svg", ".png", ".jpg", ".ico"],
                }
            ]
        },
        dirDeclaration: {
            src: {
                dirPath: 'src',
                fileDeclaration: {
                    code: { extension: '.ts' },
                    designer: { extension: '.designer.ts' },
                    tsLayout: { extension: '.html.ts' },
                    htmlLayout: { extension: '.htm' },
                }
            },
            out: {
                dirPath: 'out',
                fileDeclaration: {
                    code: { extension: '.js' },
                    designer: { extension: '.designer.js' },
                    tsLayout: { extension: '.html.js' },
                }
            }
        },
        fileCommonDeclaration: {
            designer: { subDirPath: 'designerFiles' },
            scss: { extension: '.scss' },
            html: { extension: '.html' },
        },
        outDec: "out",
        srcDec: "src",
    },
});