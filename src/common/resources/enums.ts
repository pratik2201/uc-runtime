export interface AssemblyRegistry { }
export type AssemblyList = keyof AssemblyRegistry;
export interface ResourceNamedRegistry { }
export type ResourceNamedList = keyof ResourceNamedRegistry;

export interface ResourceKeyRegistry { }
export type ResourceKeyList = keyof ResourceKeyRegistry;

export type BuildResourceType = "css" | "html" | "image" | "text" | "raw" | "data" | "string";
export class BuildResource {
    guid: string;
    encrypt?: boolean = false;
    name?: string;
    type: BuildResourceType;
    content: string;
    source?: string;
}
export class UserResource extends BuildResource {
    /**
     * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
     * THAT CSS AS PROJECT'S GLOBAL CSS
     */
    isGlobalCss? = false;
    importar?: string;
    project?: AssemblyList;
}

export class ResourceKeyBridge {

    // how placeholders look in text
    static PREFIX = "__RES::";
    static SUFFIX = "__";

    // __RES::sharepnl:css:uuid__
    static PLACEHOLDER_RE = /__RES::([a-zA-Z0-9._:-]+)__/g;

    // ----------------------------
    // make "__RES::key__"
    // ----------------------------
    static makeKey(key: string): string {
        return `${this.PREFIX}${key}${this.SUFFIX}`;
    }

    // ----------------------------
    // extract "sharepnl:css:uuid"
    // ----------------------------
    static extractKey(placeholder: string): string | null {
        if (!placeholder.startsWith(this.PREFIX) || !placeholder.endsWith(this.SUFFIX))
            return null;

        return placeholder.slice(
            this.PREFIX.length,
            placeholder.length - this.SUFFIX.length
        );
    }

    // ----------------------------
    // find all keys inside text
    // ----------------------------
    static findAll(text: string): string[] {
        const out: string[] = [];
        let m: RegExpExecArray | null;

        this.PLACEHOLDER_RE.lastIndex = 0;

        while ((m = this.PLACEHOLDER_RE.exec(text))) {
            out.push(m[1]);
        }
        return out;
    }

    // ----------------------------
    // replace placeholders
    // ----------------------------
    static replace(
        text: string,
        resolver: (key: string) => string
    ): string {
        return text.replace(this.PLACEHOLDER_RE, (_m, key) => {
            return resolver(key);
        });
    }

    // ----------------------------
    // quick check
    // ----------------------------
    static isPlaceholder(value: string): boolean {
        return value.startsWith(this.PREFIX) && value.endsWith(this.SUFFIX);
    }
}