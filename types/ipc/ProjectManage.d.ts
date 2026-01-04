import { IResolvePathResult, PreloadFullFill } from "./enumAndMore.js";
import { ProjectRowR } from "./enumAndMore.js";
export declare class ProjectManage {
    static projects: ProjectRowR[];
    static PROJECT_COUNTER: number;
    static PROJECT_PATH: string;
    static wu: PreloadFullFill;
    static init(): void;
    static FILL_PROJECTS(_project: ProjectRowR): ProjectRowR;
    static getInfoByProjectPath(path: string): ProjectRowR | undefined;
    static getInfoByAlices(alices: string): ProjectRowR | undefined;
    static getInfo(_path: string, callerMetaUrl: string): IResolvePathResult | undefined;
    static resolve(filePath: string, importMetaUrl: string): string;
}
