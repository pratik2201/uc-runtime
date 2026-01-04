import fs from 'node:fs';
import path from 'node:path';
export function scanAllProjects(mainRoot = process.cwd()) {
    const result = [];
    function readProject(projectRoot) {
        const ucconfigPath = path.join(projectRoot, 'ucconfig.json');
        if (!fs.existsSync(ucconfigPath))
            return;
        try {
            const json = JSON.parse(fs.readFileSync(ucconfigPath, 'utf8'));
            const relPath = path.relative(mainRoot, projectRoot) || '.';
            result.push({
                rootPath: relPath.replace(/\\/g, '/'),
                projectName: json.name ?? path.basename(projectRoot),
                browser: json.browser ?? {}
            });
        }
        catch {
            /* ignore invalid */
        }
    }
    // ✅ main project first
    readProject(mainRoot);
    // ✅ recursive scan
    function walk(dir) {
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            const full = path.join(dir, entry.name);
            readProject(full);
            walk(full);
        }
    }
    walk(path.join(mainRoot, 'node_modules'));
    return result;
}
export function createImportMap(projects) {
    const importMap = {
        scopes: {}
    };
    for (const project of projects) {
        const isMain = project.rootPath === '.';
        const scopeKey = isMain
            ? '.'
            : `./${project.rootPath}/`;
        importMap.scopes[scopeKey] ??= {};
        const scope = importMap.scopes[scopeKey];
        // ✅ ALWAYS add project-name alias
        scope[`${project.projectName}/`] =
            isMain ? './' : `./${project.rootPath}/`;
        // ✅ add browser.importmap aliases
        for (const [alias, value] of Object.entries(project.browser.importmap ?? {})) {
            const a = alias.endsWith('/') ? alias : `${alias}/`;
            const v = value.startsWith('./') ? value : `./${value}`;
            scope[a] = v;
        }
    }
    return importMap;
}
//# sourceMappingURL=importMapGenerator.js.map