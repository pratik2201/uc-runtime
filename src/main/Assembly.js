export class Assembly {
    name;
    id;
    guid;
    cssGuid;
    ucConfigGuid;
    srcNode;
    defaultLoadAt;
}
export class AssemblyManager {
    static counter = 0;
    static assemblies = {};
    static getAssemblies() { return this.assemblies; }
    static Register(row) {
        if (!(row.name in this.assemblies)) {
            row.id = this.counter++;
            this.assemblies[row.name] = row;
        }
    }
    static Parse(guid) {
        const k = guid.split(':', 1)?.shift();
        return this.assemblies[k];
    }
    static GetAssemblyByName(name) {
        return this.assemblies[name];
    }
}
//# sourceMappingURL=Assembly.js.map