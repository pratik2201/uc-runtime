import { IImportMap, ProjectRowM } from "./enumAndMore.js";
export declare class ConfigFiller {
    MAIN_CONFIG: ProjectRowM;
    PREELOAD_IMPORT: string[];
    ucConfigList: ProjectRowM[];
    _setRootDirecory(row: ProjectRowM, _absolutePath: string): void;
    importmap: IImportMap;
    GetByImportMeta(fileimportMeta: string): ProjectRowM;
    GetByAlias(primaryAlicePath: string): ProjectRowM;
    Fill_ImportMap(_config: ProjectRowM): void;
    ucConfig: ProjectRowM;
    fill(mainDirPath: string): void;
    updateAliceToPath(linearPushAr: ProjectRowM[]): void;
    private Fill_UCConfig;
    listProjectPath(projectDir: string): string[];
    getProjectDir(_dirPath: string): string;
}
