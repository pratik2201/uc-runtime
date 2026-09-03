import { AssemblyRegistry, ResourceKeyList, ResourceKeyRegistry, AssemblyList } from "ap-shared-core/core-common.js";
import { SourceNode } from "../lib/StampGenerator.js";
import { existsSync } from "fs";
import { join } from "path";


export class Assembly {
    name: keyof AssemblyRegistry;
    id?: number;
    ProjectGUID: string;
    ProjectCSS: ResourceKeyList;
    ProjectUcConfig: ResourceKeyList;
    srcNode?: SourceNode;
    ResourceStorageDir?: string;
    defaultLoadAt?: HTMLElement;
}
export class AssemblyManager {
    static AKey = '9795E46A-A93F-4DC3-B6D6-F2696FA0CEC5';
    private static counter = 0;
    static assemblies: ResourceKeyRegistry = {} as any;
    static getAssemblies() { return this.assemblies; }

    static Register(row: Assembly) {
        if (!(row.name in this.assemblies)) {
            row.id = this.counter++;            
            this.assemblies[row.name] = row as never;
        }
    }
    static Parse(guid: ResourceKeyList) {
        if (guid == undefined) { debugger; return; }
        const k = (guid as string).split(':', 1)?.shift() as AssemblyList;
        return this.assemblies[k] as Assembly;
    }
    static GetAssemblyByName(name: AssemblyList) {
        return this.assemblies[name] as Assembly;
    }
}