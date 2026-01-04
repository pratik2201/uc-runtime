import { ucUtil } from "../global/ucUtil.js";
import { ISourceFileTypeMap, SourceType, SourceFileType, GetProject, ProjectRowBase, correctpath, subtractPath, IBuildDirectory, IBuildDirectoryResult } from "../ipc/enumAndMore.js";
export class PathBridge {
    static path: (typeof import("../nodeFn.js").nodeFn)['path'];
    static url: (typeof import("../nodeFn.js").nodeFn)['url'];
    static source: ProjectRowBase<any>[];
    static CheckAndSetDefault = () => {
        const _this = this;
        if (_this.GetFullPath == undefined && PathBridge.path != undefined) {
            _this.GetFullPath = (path: string, basePath: string) => {
                if (PathBridge.path.isAbsolute(path)) return path;
                return _this.path.resolveFilePath(basePath, path);
            }
        }
        if (_this.Convert == undefined && PathBridge.path != undefined && PathBridge.url != undefined) {

            const rootDir = this.path.resolve();
            function givaAll(givenType: SourceFileType, path: string, fromSrcType: SourceType = 'src', toSrcType: SourceType = 'src') {
                let rtrn: IBuildDirectoryResult = {};
                //debugger;
                let prj = GetProject(path, PathBridge.source as any, PathBridge.url as any);
                if (givenType == undefined || prj == undefined) { console.log(path); return undefined; }
                const pref = prj.config.preference;
                const dirDeclaration = pref.dirDeclaration;
                let right = '';
                // const DirOfFileType = prj.directoryOfFileType;
                // const SourceDir = prj.directoryOfType;
                // const midToReduce = prj.directoryOfFileType[givenType];
                // const midToReduce = fileWisePath[givenType];
                const givenDirectoryDeclaration = dirDeclaration[fromSrcType];
                const givenFileWisePath = givenDirectoryDeclaration.fileWisePath;
                const givenFileDeclaration = givenFileWisePath[givenType];
                const demandDeclaration = dirDeclaration[toSrcType];
                const demandFileWisePath = demandDeclaration.fileWisePath;
                // let _srcDir = SourceDir[toSrcType];
                // let fromType = SourceDir[fromSrcType]; 
                right = subtractPath(correctpath(`${rootDir}/${givenDirectoryDeclaration.dirPath}/${givenFileDeclaration.dirPath}`), path, _this.path as any);

                for (const [key, typeDec] of Object.entries(dirDeclaration)) {
                    rtrn[key] = {} as any;
                    const fWisePath = rtrn[key];
                    for (const [fileType, fileDec] of Object.entries(typeDec.fileWisePath)) {

                        fWisePath[fileType] = PathBridge.changeExt(PathBridge.path.join(rootDir, typeDec.dirPath, fileDec.dirPath, right),
                            `${givenFileDeclaration.extension}` as any,
                            `${fileDec.extension}` as any);

                    }
                    // rtrn[key] = {
                    //     designer: PathBridge.changeExt(PathBridge.path.join(rootDir, SourceDir['src'], DirOfFileType['designer'], right), givenType, 'designer'),
                    //     code: PathBridge.changeExt(PathBridge.path.join(rootDir, SourceDir['src'], DirOfFileType['code'], right), givenType, 'code'),
                    //     html: PathBridge.changeExt(PathBridge.path.join(rootDir, _srcDir, DirOfFileType['html'], right), givenType, 'html'),
                    //     scss: PathBridge.changeExt(PathBridge.path.join(rootDir, _srcDir, DirOfFileType['scss'], right), givenType, 'scss'),
                    // }
                }
                /*rtrn = {
                    "designer": PathBridge.changeExt(PathBridge.path.join(rootDir, SourceDir['src'], DirOfFileType['designer'], right), sourceType, 'designer'),
                    "code": PathBridge.changeExt(PathBridge.path.join(rootDir, SourceDir['src'], DirOfFileType['code'], right), sourceType, 'code'),
                    "html": PathBridge.changeExt(PathBridge.path.join(rootDir, _srcDir, DirOfFileType['html'], right), sourceType, 'html'),
                    "scss": PathBridge.changeExt(PathBridge.path.join(rootDir, _srcDir, DirOfFileType['scss'], right), sourceType, 'scss'),
                    //".designer.js": PathBridge.changeExt(PathBridge.path.join(rootDir, toType, DirOfFileType['.designer.js'], right), sourceType, '.designer.js'),
                    //".js": PathBridge.changeExt(PathBridge.path.join(rootDir, toType, DirOfFileType['.js'], right), sourceType, '.js'),
                }*/
                return rtrn;
            }
            _this.Convert = (path, givenDeclareType, givenFileType, demandDeclareType) => {
                //let gtype: SourceFileType = givenFileType;
                // if (gtype == undefined) {
                //     let ext = 
                //     const s = GiveSourceFileTypeFeedBack(path);
                // }
                return givaAll(givenFileType, path, givenDeclareType, demandDeclareType ?? givenDeclareType);
            }
        }

    }
    static Convert: (path: string, pathDeclare: SourceType, givenFileType: SourceFileType, demandPathtype?: SourceType)
        => IBuildDirectoryResult;

    static changeExt = (path: string, from: SourceFileType, to: SourceFileType): string => {
        return ucUtil.changeExtension(path, from, to);
    }
    static GetFullPath: (path: string, basePath: string) => string;
    /*
    static GetFullPath = (path: string, basePath: string) => {
        throw new Error('`PathBridge.GetFullPath` NOT DEFINED')
        return path;
    }*/


}



/*
const Dirs: SourceFileTypeMap = {
    '.html': '',
    '.scss': '',
    '.ts': '',
    '.designer.ts': '_designer',
    '.js': '',
    '.designer.js': '_designer',
}
const SourceDir = {
    out: 'out',
    src: '',
}

const rootDir = nodeFn.path.resolve();
PathBridge.GetFullPath = (path: string, basePath: string) => {
    return nodeFn.path.resolveFilePath(basePath, path);
}
function givaAll(sourceType: SourceFileType, path: string, fromSrcType: SourceType = 'src', toSrcType: SourceType = 'src') {
    let rtrn: SourceFileTypeMap = {} as any;
    if (sourceType == undefined) return rtrn;
    let right = '';
    const midToReduce = Dirs[sourceType];
    let toType = SourceDir[toSrcType];
    let fromType = SourceDir[fromSrcType];
    right = nodeFn.path.subtractPath(`${rootDir}/${fromType}/${midToReduce}`["#toFilePath"](), path);
    rtrn = {
        ".designer.ts": PathBridge.changeExt(nodeFn.path.join(rootDir, SourceDir['src'], Dirs['.designer.ts'], right), sourceType, '.designer.ts'),
        ".ts": PathBridge.changeExt(nodeFn.path.join(rootDir, SourceDir['src'], Dirs['.ts'], right), sourceType, '.ts'),
        ".html": PathBridge.changeExt(nodeFn.path.join(rootDir, toType, Dirs['.html'], right), sourceType, '.html'),
        ".scss": PathBridge.changeExt(nodeFn.path.join(rootDir, toType, Dirs['.scss'], right), sourceType, '.scss'),
        ".designer.js": PathBridge.changeExt(nodeFn.path.join(rootDir, toType, Dirs['.designer.js'], right), sourceType, '.designer.js'),
        ".js": PathBridge.changeExt(nodeFn.path.join(rootDir, toType, Dirs['.js'], right), sourceType, '.js'),
    }
    return rtrn;
}
PathBridge.Convert = (path, pathType, givenType) => {
    return givaAll(givenType ?? PathBridge.GiveFeedBack(path), path, pathType, pathType);
}
*/