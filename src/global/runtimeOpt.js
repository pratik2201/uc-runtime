import { GetRandomNo, GetUniqueId } from "../common/ipc/enumAndMore.js";
export const GLOBAL_OPTIONS = {
    tabindexes: {
        allowTabInAllForms: true,
    },
};
export const ATTR_OF = {
    __CLASS: (id, type) => {
        return ATTR_OF.UC.ALLC + '' + type + '' + id;
    },
    setUc: (u) => {
        return "." + ATTR_OF.UC.UC_STAMP + "" + u;
    },
    setParent: (u) => {
        return "." + ATTR_OF.UC.CLASS_PARENT + "" + u;
    }, setRoot: (u) => {
        return "." + ATTR_OF.UC.CLASS_ROOT + "" + u;
    },
    getParent: (p, r) => {
        return [ATTR_OF.UC.CLASS_PARENT + "" + p, ATTR_OF.UC.CLASS_ROOT + "" + r];
    },
    getUc: (u) => {
        return ATTR_OF.UC.UC_STAMP + "" + u;
    },
    X_NAME: "x-name",
    X_FROM: "x-from",
    BASE_OBJECT: "base_object",
    SCOPE_KEY: "x-scope",
    ACCESSIBLE_KEY: "id",
    TEMPLETE_DEFAULT: "primary",
    UC: Object.freeze({
        ALLC: "c" + GetRandomNo(1, 9999),
        ALL: "all" + GetUniqueId(),
        UC_STAMP: "uc" + GetUniqueId(),
        CLASS_PARENT: "parent" + GetUniqueId(),
        CLASS_ROOT: "root" + GetUniqueId(),
        CSSStyleDeclarations: 'CSSStyleDeclarations_' + GetUniqueId(),
        //PARENT_STAMP: "parent" + uniqOpt.randomNo(),
        // UNIQUE_STAMP: "uniq" + uniqOpt.randomNo(),
        //ROOT_STAMP: "root" + uniqOpt.randomNo(),
    }),
};
//# sourceMappingURL=runtimeOpt.js.map