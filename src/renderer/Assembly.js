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
    static AKey = '9795E46A-A93F-4DC3-B6D6-F2696FA0CEC5';
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
        if (guid == undefined) {
            debugger;
            return;
        }
        const k = guid.split(':', 1)?.shift();
        return this.assemblies[k];
    }
    static GetAssemblyByName(name) {
        return this.assemblies[name];
    }
}
//# sourceMappingURL=Assembly.js.map