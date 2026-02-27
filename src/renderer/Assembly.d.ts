import { AssemblyRegistry, ResourceKeyList, ResourceKeyRegistry, AssemblyList } from "ap-shared-core/out/enums.js";
import { SourceNode } from "../lib/StampGenerator.js";
export declare class Assembly {
    name: keyof AssemblyRegistry;
    id?: number;
    guid: string;
    cssGuid: ResourceKeyList;
    ucConfigGuid: ResourceKeyList;
    srcNode?: SourceNode;
    defaultLoadAt?: HTMLElement;
}
export declare class AssemblyManager {
    static AKey: string;
    private static counter;
    static assemblies: ResourceKeyRegistry;
    static getAssemblies(): ResourceKeyRegistry;
    static Register(row: Assembly): void;
    static Parse(guid: ResourceKeyList): Assembly;
    static GetAssemblyByName(name: AssemblyList): Assembly;
}
