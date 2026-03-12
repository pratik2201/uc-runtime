import { UcDefaultConfig } from "uc-runtime/core-main.js";
export default UcDefaultConfig({
    guid: "f1441d07-173e-42ef-8ce0-df5f564c546e",
    cli: {
        useElectron: false,
        useTypeScript: true,
        codeFileExt: ".ts",
        outputFileExt: ".js",
        designerDir: "designerFiles",
        srcDir: "src",
        outDir: "dist",
        ResourceStorageFile: "designerFiles/Resources.ts",
        baseCssPath: "styles.scss",
        devtools: true,
        removeMenu: true,
    },
    browser: {
        resolveProjects: ["uc-dev"],
        importmap: {
            "core.js":"dist/core.js",
            "core-main.js": "dist/core-main.js",
            "package.json": "package.json",
            "designerFiles/Resources.js": "dist/designerFiles/Resources.js"
        },
    },
    projectBaseCssPath: "",
    preference: {
        build: {
            ignorePath: ["node_modules", ".git", ".vscode", "dist",],
            RuntimeResources: [
                {
                    includeExtensions: [".jpg", ".png", ".html", ".scss", ".ico", ".svg",],
                    fromDeclare: "src",
                    toDeclares: ["out"]
                }
            ],
            guidOptions: {
                guidType: "sequenceAndSameGuid",
                sequencePadSize: 8,
            }
        },

        dirDeclaration: {
            src: {
                /* 
                i.e
                ./[src]/lib/file.uc.ts     =>    ./src/lib/file.uc.ts  
                ./[]/lib/file.uc.html     =>    ./lib/file.uc.html
                */
                dirPath: 'src',
                /**
                 *  i.e 
                 * dirDeclaration.src.dirpath = 'src';
                 * dirDeclaration.src.fileDeclaration.subDirPath = 'designerFiles';
                 *
                 * ./[src]/[designerFiles]/lib/file.uc.designer.ts     =>    ./src/designerFiles/lib/file.uc.designer.ts
                 * ./[src]/[]/lib/file.uc.ts     =>    ./src/lib/file.uc.ts
                 *
                 * dirDeclaration.src.fileDeclaration.subDirPath = ''
                 * ./[src]/[]/lib/file.uc.ts     =>    ./src/lib/file.uc.ts
                 *
                 * dirDeclaration.src.fileDeclaration.subDirPath = 'htmlFiles'
                 * ./[src]/[htmlFiles]/lib/file.uc.designer.ts     =>    ./src/htmlFiles/lib/file.uc.designer.ts
                 *   
                 *  Same for out declaration 
                 */
                fileDeclaration: {
                    code: { extension: '.ts', },
                    designer: { subDirPath: 'designerFiles', extension: '.designer.ts', },
                    scss: { extension: '.scss', },
                    html: { extension: '.html', },
                }
            },
            out: {
                /* 
                i.e
                ./[out]/lib/file.uc.js     =>    ./out/lib/file.uc.js  
                ./[]/lib/file.uc.html     =>    ./lib/file.uc.html
                */
                dirPath: 'dist',
                fileDeclaration: {
                    code: { extension: '.js', },
                    designer: { subDirPath: 'designerFiles', extension: '.designer.js', },
                    scss: { extension: '.scss', },
                    html: { extension: '.html', },
                }
            }
        },
        /**
        * A common Declaration  for all declarations specified in `dirDeclaration` 
        * (i.e src,out)
        */
        fileCommonDeclaration: {
            designer: { subDirPath: 'designerFiles', },
            scss: { extension: '.scss', },
            html: { extension: '.html', },
        },
        /**
         * specify dirDeclaration key for source
         */
        srcDec: "src",
        /**
         * specify dirDeclaration key for output
         */
        outDec: "out"
    },
});