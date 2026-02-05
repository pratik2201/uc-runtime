
import { AssemblyList, ResourceKeyList, ResourceKeyRegistry } from "ap-shared-core/out/ucbuilder/resources/enums.js";
import { SourceNode } from "../lib/StampGenerator.js";

export class Assembly {
    name: AssemblyList;
    id?: number;
    guid: string;
    cssGuid: ResourceKeyList;
    ucConfigGuid: ResourceKeyList;
    srcNode?: SourceNode;
    defaultLoadAt?: HTMLElement;
    //config: UserUCConfig;
}
export class AssemblyManager {
    private static counter = 0;
    static assemblies: ResourceKeyRegistry = {};
    static getAssemblies() { return this.assemblies; }

    static Register(row: Assembly) {
        if (!(row.name in this.assemblies)) {
            row.id = this.counter++;
            this.assemblies[row.name] = row as never;
        }
    }
    static Parse(guid: ResourceKeyList) {
        const k = (guid as string).split(':', 1)?.shift() as AssemblyList;
        return this.assemblies[k] as Assembly;
    }
    static GetAssemblyByName(name: AssemblyList) {
        return this.assemblies[name] as Assembly;
    }
}