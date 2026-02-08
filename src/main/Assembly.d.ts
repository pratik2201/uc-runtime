import { AssemblyList, ResourceKeyList, ResourceKeyRegistry } from "ap-shared-core/out/ucbuilder/resources/enums.js";
import { SourceNode } from "../lib/StampGenerator.js";
export declare class Assembly {
    name: AssemblyList;
    id?: number;
    guid: string;
    cssGuid: ResourceKeyList;
    ucConfigGuid: ResourceKeyList;
    srcNode?: SourceNode;
    defaultLoadAt?: HTMLElement;
}
export declare class AssemblyManager {
    private static counter;
    static assemblies: ResourceKeyRegistry;
    static getAssemblies(): ResourceKeyRegistry;
    static Register(row: Assembly): void;
    static Parse(guid: ResourceKeyList): Assembly;
    static GetAssemblyByName(name: AssemblyList): Assembly;
}
