
import { ucUtil } from "../global/ucUtil.js";
import { nodeFn } from "../nodeFn.js";
import { IPC_API_KEY, PreloadFullFill, ProjectRowR } from "./enumAndMore.js";
import { IpcRendererHelper } from "./IpcRendererHelper.js";

export class ProjectManage {
    static projects: ProjectRowR[] = [];
    static PROJECT_COUNTER = 0;
    static PROJECT_PATH = "";
    static wu: PreloadFullFill;
    static init() {
        const prj = IpcRendererHelper.ucConfig;
        this.PROJECT_PATH = prj.projectPath;
        this.wu = window[IPC_API_KEY].fullFill;
        this.FILL_PROJECTS(prj as any);
    }

    static FILL_PROJECTS(_project: ProjectRowR): ProjectRowR {
       // console.log(_project);
        //return;
        let newProject = Object.assign(new ProjectRowR(), _project);
        newProject.id = ProjectManage.PROJECT_COUNTER++;
        ProjectManage.projects.push(newProject);
        ProjectManage.projects.sort((a, b) => b.importMetaURL.length - a.importMetaURL.length);
        let childs: ProjectRowR[] = [];
        for (let i = 0, iObj = _project.children, ilen = iObj.length; i < ilen; i++) {
            childs.push(ProjectManage.FILL_PROJECTS(iObj[i]));
        }
        newProject.children = childs;
        return newProject;
    }
    /*static getMetaUrl(fullPath: string) {
        fullPath = correctpath(fullPath);
        return this.projects.find(row => fullPath.startsWith(row.projectPath))?.importMetaURL;
    }*/
    static getInfoByProjectPath(path: string): ProjectRowR | undefined {
        let findex = this.projects.findIndex(s => nodeFn.path.isSamePath(path,s.projectPath));
        if (findex == -1) return undefined;
        return this.projects[findex];
    }
    static getInfoByAlices(alices: string): ProjectRowR | undefined {

        let findex = this.projects.findIndex(s => ucUtil.equalIgnoreCase(alices,s.projectPrimaryAlice));
        if (findex == -1) return undefined;
        return this.projects[findex];
    }
    // static getInfo(_path: string, callerMetaUrl: string): IResolvePathResult | undefined {
    //     return resolvePathObject(_path, callerMetaUrl, ProjectManage.projects,undefined, nodeFn.path as any, nodeFn.url as any);
    // }
    // static resolve(filePath: string, importMetaUrl: string): string {
    //     importMetaUrl = importMetaUrl ?? getMetaUrl<ProjectRowR>(filePath, this.projects);
    //     return resolvePathObject(filePath, importMetaUrl, ProjectManage.projects,undefined, nodeFn.path as any, nodeFn.url as any)?.result;
    // }

}
