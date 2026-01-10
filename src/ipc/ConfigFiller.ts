import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { ucUtil } from "../global/ucUtil.js";
import { correctpath, deepAssign, GetProjectName, IImportMap, IUCConfigPreference, ProjectRowBase, UcBuildOptions, UserUCConfig } from "./enumAndMore.js";
import { ImportUserConfig } from "./userConfigManage.js";

export class ConfigFiller {
    MAIN_CONFIG: ProjectRowBase;
    PREELOAD_IMPORT: string[] = [];
    ucConfigList: ProjectRowBase[] = [];

    _setRootDirecory(row: ProjectRowBase, projPath: string) {
        row.projectPath = projPath;
        const cfg = row.config;
        let mainProjPath = path.resolve();
        row.rootPath = correctpath(path.normalize(path.relative(mainProjPath, row.projectPath)));
        row.rootPath = row.rootPath == '.' ? '.' : `./${row.rootPath}/`;
        /*if (row.rootPath == '.') {
            let kys = Object.keys(cfg.browser.globalAlias);
            for (let i = 0, iObj = kys, ilen = iObj.length; i < ilen; i++) {
                const iKey = iObj[i];
                const iValue = cfg.browser.globalAlias[iKey];
                const custResolve = resolvePathObject(iValue, projPath, [], undefined, path, url).result;
                const trimedPath = correctpath(subtractPath(mainProjPath, custResolve, path));
                cfg.browser.globalAlias[iKey] = trimedPath;
            }
        }*/
        let pref = cfg.preference = cfg.preference ?? {} as IUCConfigPreference;
        row.projectPrimaryAlice = row.projectName;
        pref.srcDir = (pref.srcDir ?? "") as any;
        pref.outDir = (pref.outDir ?? "") as any;
        cfg.projectBaseCssPath = (cfg.projectBaseCssPath ?? "");



        cfg.browser.importmap[row.projectPrimaryAlice] = '';
        cfg.preloadMain = cfg.preloadMain ?? [];
        for (let i = 0, preeloadFiles = cfg.preloadMain, ilen = preeloadFiles.length; i < ilen; i++) {
            let PTH = correctpath(path.join(row.projectPath, ucUtil.devEsc(preeloadFiles[i])));
            preeloadFiles[i] = PTH;
        }

    }
    importmap: IImportMap = {
        imports: {},
        scopes: {

        }
    };
    GetByImportMeta(fileimportMeta: string): ProjectRowBase {
        return this.ucConfigList.find(cfg => fileimportMeta.startsWith(cfg.importMetaURL)) || null;
    }
    GetByAlias(primaryAlicePath: string): ProjectRowBase {
        return this.ucConfigList.find(cfg => primaryAlicePath.startsWith(cfg.projectPrimaryAlice)) || null;
    }
    Fill_ImportMap(_config: ProjectRowBase) {
        const aliases = {};
        const pathAlias = _config.config?.browser?.importmap ?? {};
        for (let [als, relPath] of Object.entries(pathAlias)) {
            als = ucUtil.trimPath(als);
            const np = ucUtil.trimPath(correctpath(path.join(_config.rootPath, relPath)));
            aliases[`${als}/`] = `./${np}/`;
        }
        if (this.importmap.scopes[_config.rootPath] == undefined)
            this.importmap.scopes[_config.rootPath] = aliases;
        for (let i = 0, iObj = _config.children, ilen = iObj.length; i < ilen; i++) {
            const iItem = iObj[i];
            this.Fill_ImportMap(iItem);
        }
    }
    ucConfig = new ProjectRowBase();
    fill = async (mainDirPath: string) => {

        let projectDir = this.getProjectDir(mainDirPath);

        await this.Fill_UCConfig(projectDir, this.ucConfig);

        const cfg = this.MAIN_CONFIG.config;
        const pref = cfg.preference;
        pref.build = Object.assign(new UcBuildOptions(), pref.build);

        const bld = pref.build;
        if (bld.keyBind == undefined || bld.keyBind.length == 0)
            bld.keyBind = ['ControlRight', 'F12'];

        this.PREELOAD_IMPORT = ucUtil.distinct(this.PREELOAD_IMPORT);
        this.ucConfigList.sort((a, b) => b.importMetaURL.length - a.importMetaURL.length);
        this.updateAliceToPath(this.ucConfigList);
        this.generateResource();
        this.Fill_ImportMap(this.ucConfig);
    }
    generateResource = () => {
        const cfg = this.MAIN_CONFIG.config;

        if (cfg.env == 'release') return;
        const pref = cfg.preference;
        const dirDeclaration = pref.dirDeclaration;
        const runtimeRes = pref.build?.RuntimeResources ?? [];
        // const dirDeclaration = pref.dirDeclaration;

        runtimeRes.forEach(res => {
            const SRC_DIR = pref.dirDeclaration[res.fromDeclare].dirPath;
            function copyAssets(fromDir: string) {
                const dirContents = fs.readdirSync(fromDir);
                for (const file of dirContents) {
                    const full = path.join(fromDir, file);
                    const isDirectory = fs.statSync(full).isDirectory();
                    //if (IGNORE_PATH.includes(full)) continue;
                    let fileExt = file.substring(file.lastIndexOf('.'));
                    if (isDirectory) {
                        copyAssets(full);
                    } else if (res.includeExtensions.includes(fileExt)) {
                        const commonPath = path.relative(SRC_DIR, full);
                        res.toDeclares.forEach(ot => {
                            let OUT_DIR = dirDeclaration[pref.outDir].dirPath;
                            const dest = path.join(OUT_DIR, commonPath);
                            fs.mkdirSync(path.dirname(dest), { recursive: true });
                            fs.copyFileSync(full, dest);
                        });
                    }
                }
            }
            copyAssets(SRC_DIR);
        });
    }
    updateAliceToPath(linearPushAr: ProjectRowBase[]) {
        let p_path = this.MAIN_CONFIG.projectPath;
        for (let i = 0, iObj = linearPushAr, ilen = iObj.length; i < ilen; i++) {
            const iUc = iObj[i];
            for (const [pathAliasKey, pathAliasValue] of Object.entries(iUc.config.browser.importmap)) {
                let fullPath = correctpath(path.join(p_path, pathAliasValue) + '/');
                let p = linearPushAr.find(s => fullPath.startsWith(s.projectPath));
                if (p != undefined)
                    iUc.aliceToPath[pathAliasKey] = p.projectPath;
            }
        }
    }
    private async Fill_UCConfig(projectDirPath: string, row: ProjectRowBase) {
        if (projectDirPath != undefined) {
            let projectName = GetProjectName(projectDirPath, path, fs);
            let ucConfigPath = path.join(projectDirPath, 'ucconfig.js');
            let ucCfg = await ImportUserConfig(ucConfigPath);
            if (ucCfg != undefined) {
                row.config = deepAssign(row.config ?? new UserUCConfig(), ucCfg);
                const cfg = row.config;
                if (this.MAIN_CONFIG == undefined) this.MAIN_CONFIG = row;
                row.projectName = projectName;
                this._setRootDirecory(row, correctpath(projectDirPath));
                this.PREELOAD_IMPORT.push(...cfg.preloadMain);
                this.ucConfigList.push(row);
                row.importMetaURL = url.pathToFileURL(projectDirPath).href;
                let dirs = this.listProjectPath(projectDirPath);
                for (let i = 0, ilen = dirs.length; i < ilen; i++) {
                    const child_project_dir = dirs[i];
                    let nchild = new ProjectRowBase();
                    await this.Fill_UCConfig(child_project_dir, nchild);
                    row.children.push(nchild);
                }
            }
        }
    }
    listProjectPath(projectDir: string) {
        let child_projects_dirpath = path.join(projectDir, 'node_modules');
        let child_project_dirList: string[] = [];
        if (fs.existsSync(child_projects_dirpath)) {
            let child_projects = fs.readdirSync(child_projects_dirpath);
            child_projects.forEach(project_name => {
                let child_project_configfile = path.join(child_projects_dirpath, project_name, 'ucconfig.js');
                if (fs.existsSync(child_project_configfile)) {
                    child_project_dirList.push(path.join(child_projects_dirpath, project_name));
                }
            });
        }
        return child_project_dirList;
    }

    getProjectDir(_dirPath: string) {
        let package_path = '';
        do {
            package_path = path.join(_dirPath, 'package.json');
            _dirPath = path.dirname(_dirPath);
        } while (!fs.existsSync(package_path))
        return path.dirname(package_path);
    }
}


