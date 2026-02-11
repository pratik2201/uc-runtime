export class BuildResource {
    constructor() {
        this.type = null;
        this.content = null;
    }
}
export class UserResource extends BuildResource {
    constructor() {
        super(...arguments);
        /**
         * ONLY ONE RESOURCE SHOULD ASSIGN THIS OPTION TRUE TO USE
         * THAT CSS AS PROJECT'S GLOBAL CSS
         */
        this.isGlobalCss = false;
    }
}
export class ResourceKeyBridge {
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
// how placeholders look in text
ResourceKeyBridge.PREFIX = "__RES::";
ResourceKeyBridge.SUFFIX = "__";
// __RES::sharepnl:css:uuid__
ResourceKeyBridge.PLACEHOLDER_RE = /__RES::([a-zA-Z0-9._:-]+)__/g;
