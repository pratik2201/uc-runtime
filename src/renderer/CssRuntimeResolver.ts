
import { ResourceKeyList, ResourceKeyBridge } from "ap-shared-core/out/ucbuilder/resources/enums.js";
import { ResourceManage } from "./ResourceManage.js";



const SCSS_IMPORT_RE =
  /@(use|import)\s+(?:url\()?["']([^"')]+)["']\)?\s*;/gi;

const CSS_URL_RE =
  /url\(\s*["']?([^"')]+)["']?\s*\)/gi;

export class CssRuntimeResolver {

  private loaded = new Set<string>();

  // ---------- ENTRY POINTS ----------

  resolveFromKey(cssKey: ResourceKeyList): string {
    this.loaded.clear();

    const res = ResourceManage.get(cssKey);
    if (!res || res.type !== "css") {
      console.warn("CSS resource missing:", cssKey);
      return "";
    }

    return this.resolveCss(res.content);
  }

  resolveFromContent(cssContent: string): string {
    this.loaded.clear();
    return this.resolveCss(cssContent);
  }

  // ---------- CORE ----------

  private resolveCss(css: string): string {
    css = this.resolveImports(css);
    css = this.resolveUrls(css);
    return css;
  }

  // ---------- IMPORT / USE ----------

  resolveImports(css: string): string {

    return css.replace(SCSS_IMPORT_RE, (_m, _type, value) => {

      if (!ResourceKeyBridge.isPlaceholder(value)) return "";

      const realKey = ResourceKeyBridge.extractKey(value) as ResourceKeyList;
      if (!realKey) return "";

      // circular safe
      if (this.loaded.has(realKey)) return "";
      this.loaded.add(realKey);

      const res = ResourceManage.get(realKey);
      if (!res || res.type !== "css") {
        console.warn("CSS import missing:", realKey);
        return "";
      }

      return this.resolveCss(res.content);
    });
  }

  // ---------- URL(...) ----------

  resolveUrls(css: string): string {

    return css.replace(CSS_URL_RE, (_m, value) => {

      if (!ResourceKeyBridge.isPlaceholder(value)) return _m;

      const realKey = ResourceKeyBridge.extractKey(value) as ResourceKeyList;
      if (!realKey) return _m;

      const asset = ResourceManage.get(realKey);
      if (!asset) {
        console.warn("Asset missing:", realKey);
        return _m;
      }

      // at runtime, url must be real data/blob/http
      return `url("${asset.content}")`;
    });
  }
}
