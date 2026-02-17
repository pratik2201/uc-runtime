export class BuildResource {
    guid;
    encrypt = false;
    name;
    type;
    content;
    source;
}
export class UserResource extends BuildResource {
    /**
     * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
     * THAT CSS AS PROJECT'S GLOBAL CSS
     */
    isGlobalCss = false;
    importar;
    project;
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
    static makeKey(key) {
        return `${this.PREFIX}${key}${this.SUFFIX}`;
    }
    // ----------------------------
    // extract "sharepnl:css:uuid"
    // ----------------------------
    static extractKey(placeholder) {
        if (!placeholder.startsWith(this.PREFIX) || !placeholder.endsWith(this.SUFFIX))
            return null;
        return placeholder.slice(this.PREFIX.length, placeholder.length - this.SUFFIX.length);
    }
    // ----------------------------
    // find all keys inside text
    // ----------------------------
    static findAll(text) {
        const out = [];
        let m;
        this.PLACEHOLDER_RE.lastIndex = 0;
        while ((m = this.PLACEHOLDER_RE.exec(text))) {
            out.push(m[1]);
        }
        return out;
    }
    // ----------------------------
    // replace placeholders
    // ----------------------------
    static replace(text, resolver) {
        return text.replace(this.PLACEHOLDER_RE, (_m, key) => {
            return resolver(key);
        });
    }
    // ----------------------------
    // quick check
    // ----------------------------
    static isPlaceholder(value) {
        return value.startsWith(this.PREFIX) && value.endsWith(this.SUFFIX);
    }
}
//# sourceMappingURL=enums.js.map