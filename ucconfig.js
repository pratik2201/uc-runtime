import { UcDefaultConfig } from "./out/core.js";
export default UcDefaultConfig({
    guid: "097DF085-D799-43EC-A783-CBFA4F228820",
    mainAlias: 'ucbuilder',
    browser: {
        resolveProjects:['ap-shared-core']
    },
    preference: {
        build: {
            ResourceDeclarationFile: 'designerFiles/Resources.ts',  
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
            html: { subDirPath: 'htmlFiles', extension: '.html' },
        },
        outDir: "out",
        srcDir: "src",
    },
});