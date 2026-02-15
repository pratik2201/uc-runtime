//import { UserUCConfig } from '../../configResources.js' 
import { safeStringify } from 'ap-shared-core/out/objectUtil.js'
import { cleanPath } from 'ap-shared-core/out/uc-control/ucUtil.js'
import fs from 'fs'
import path from 'path'
//import { ImportUserConfig } from 'uc-dev/out/lib/usderConfigManage.js'

export type BrowserConfig = {
  importmap?: Record<string, string>
  globalAlias?: Record<string, string>
}

export type ProjectEntry = {
  rootPath: string           // relative from main project
  projectName: string
  browser: BrowserConfig
}
export function ensureHead(): HTMLHeadElement {
  let html = document.documentElement
  if (!html) {
    html = document.createElement('html')
    document.appendChild(html)
  }

  let head = html.querySelector('head')
  if (!head) {
    head = document.createElement('head')
    html.insertBefore(head, html.firstChild)
  }

  return head
}

export async function scanAllProjects(
  mainRoot: string = ''//ConfigHandler.filler.MAIN_PROJECT_PATH
): Promise<ProjectEntry[]> {
  //console.log(mainRoot);

  const result: ProjectEntry[] = []

  async function readProject(projectRoot: string) {
    const ucconfigPath = path.join(projectRoot, 'ucconfig.js');
    if (!fs.existsSync(ucconfigPath)) return;

    try {
      // const json = JSON.parse(fs.readFileSync(ucconfigPath, 'utf8'))
      const json = undefined;//await ImportUserConfig(ucconfigPath) as UserUCConfig;
      const relPath = path.relative(mainRoot, projectRoot) || '.'

      result.push({
        rootPath: relPath.replace(/\\/g, '/'),
        projectName: undefined,//json.mainAlias,///*json.name ??*/ path.basename(projectRoot),
        browser: json.browser ?? {}
      })
    } catch {
      /* ignore invalid */
    }
  }

  // ✅ main project first
  await readProject(mainRoot)

  // ✅ recursive scan
  async function walk(dir: string) {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const full = path.join(dir, entry.name)
      await readProject(full)
      await walk(full)
    }
  }

  await walk(path.join(mainRoot, 'node_modules'))

  return result
}
export function createImportMap(htmlPath: string, projects: ProjectEntry[], baseDir = process.cwd()) {

  /*const docUrl = new URL(window.location.href);
  const htmlDir = docUrl.pathname.replace(/\/[^/]+$/, '/');

 
  const htmlPath =  fileURLToPath(docUrl)*/
  const htmlDirPath = path.dirname(htmlPath)

  const projectRoot = baseDir;

  const relFromHtml = '.'; /*path
    .relative(htmlDirPath, projectRoot)
    .replace(/\\/g, '/')*/

  // console.log([
  //   projectRoot,
  //   htmlDirPath,
  //   relFromHtml
  // ]);


  const importMap: {
    scopes: Record<string, Record<string, string>>
  } = {
    scopes: {}
  }

  for (const project of projects) {

    const isMain = project.rootPath === '.'
    const scopeKey = isMain
      ? `./`
      : `${relFromHtml}/${project.rootPath}/`

    importMap.scopes[scopeKey] ??= {}

    const scope = importMap.scopes[scopeKey]

    // ✅ ALWAYS add project-name alias
    scope[`${project.projectName}/`] =
      isMain ? `${relFromHtml}/` : `${relFromHtml}/${project.rootPath}/`

    // ✅ add browser.importmap aliases
    for (const [alias, value] of Object.entries(project.browser.importmap ?? {})) {
      const a = `${cleanPath(alias)}/`
      const v = `${relFromHtml}/${cleanPath(value)}/`;  //value.startsWith('./') ? value : `./${value}`
      scope[a] = v
    }
  }
  // console.log(importMap);

  return importMap
}




// export function injectImportMap(html: string, importMap: any) {
//   const importMapScript = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

//   if (/<head>/i.test(html)) {
//     return html.replace(/<head>/i, `<head>\n${importMapScript}`);
//   } else if (/<html[^>]*>/i.test(html)) {
//     return html.replace(/<html[^>]*>/i, `$&\n<head>${importMapScript}</head>`);
//   } else {
//     return `${importMapScript}\n${html}`;
//   }
// }
export function injectImportMap(htmlContent: string, importMap: any) {
  importMap = (importMap != undefined) ? importMap : {};
  const importMapScript = `<script type="importmap">${safeStringify(importMap)}</script>`;
  const headRegex = /<head\b[^>]*>/i;
  const htmlRegex = /<html\b[^>]*>/i;
  if (headRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(headRegex, match => match + importMapScript);
  }
  else if (htmlRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(htmlRegex, match => `${match}\n<head>${importMapScript}</head>`);
  }
  else {
    htmlContent = `${importMapScript}\n${htmlContent}`;
  }
  return htmlContent;
}
function findSubProjects(rootDir: string): string[] {
  const nodeModules = path.join(rootDir, "node_modules");
  if (!fs.existsSync(nodeModules)) return [];

  const dirs = fs.readdirSync(nodeModules).filter(d =>
    fs.statSync(path.join(nodeModules, d)).isDirectory()
  );

  return dirs.map(d => path.join(nodeModules, d));
}

function findSubProjectsRecursive(dir: string, seen = new Set<string>()): string[] {
  const projects: string[] = [];

  if (!fs.existsSync(dir)) return projects;

  const nodeModules = path.join(dir, "node_modules");
  if (!fs.existsSync(nodeModules)) return projects;

  const dirs = fs.readdirSync(nodeModules).filter(d =>
    fs.statSync(path.join(nodeModules, d)).isDirectory()
  );

  for (const d of dirs) {
    const fullPath = path.join(nodeModules, d);
    if (seen.has(fullPath)) continue;
    seen.add(fullPath);

    // Only include if it has ucconfig.json
    if (fs.existsSync(path.join(fullPath, "ucconfig.js"))) {
      projects.push(fullPath);
    }

    // Recursively check inside this sub-project
    const nested = findSubProjectsRecursive(fullPath, seen);
    projects.push(...nested);
  }

  return projects;
}
function toFileUrl(p: string) {
  const fullPath = path.resolve(p).replace(/\\/g, "/"); // forward slashes
  return `file:///${fullPath}/`; // note 3 slashes
}
/*
async function getBrowserConfig(projectDir: string) {
  const configPath = path.join(projectDir, "ucconfig.js");
  if (!fs.existsSync(configPath)) return null;

  const cfg = undefined;//await ImportUsedrConfig(configPath);//JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return cfg.browser || null;
}
export async function generateImportMap(mainProjectDir: string) {
  const importMap: any = { imports: {}, scopes: {} };

  const mainBrowser = await getBrowserConfig(mainProjectDir);
  const mainScope = `${toFileUrl(path.resolve(mainProjectDir).replace(/\\/g, "/"))}`;
  importMap.scopes[mainScope] = {};

  if (mainBrowser?.importmap) {
    for (const [k, v] of Object.entries(mainBrowser.importmap)) {
      importMap.scopes[mainScope][`${cleanPath(k)}/`] = `${toFileUrl(path.resolve(mainProjectDir, v as string).replace(/\\/g, "/"))}`;
    }
  }

  // Recursive sub-projects
  const subProjects = findSubProjectsRecursive(mainProjectDir);
  for (const sub of subProjects) {
    const subBrowser = await getBrowserConfig(sub);
    if (!subBrowser) continue;

    const scopeKey = `${toFileUrl(sub.replace(/\\/g, "/"))}`;
    importMap.scopes[scopeKey] = {};

    if (subBrowser.importmap) {
      for (const [k, v] of Object.entries(subBrowser.importmap)) {
        importMap.scopes[scopeKey][`${cleanPath(k)}/`] = `${toFileUrl(path.resolve(sub, v as string).replace(/\\/g, "/"))}`;
      }
    }

    // Always map project name → project root
    const projName = path.basename(sub);
    importMap.scopes[scopeKey][projName + "/"] = scopeKey;
  }

  return importMap;
}
*/