import { GetRandomNo, GetUniqueId } from "../ipc/enumAndMore.js";
export type StyleClassScopeType = "l" | "m" | "r" | "g"
export const GLOBAL_OPTIONS: {
    tabindexes: {
        allowTabInAllForms: boolean;
    };
} = {
    tabindexes: {
        allowTabInAllForms: true,
    },
};

export const ATTR_OF = {
    __CLASS: (id: string, type: StyleClassScopeType) => {
        return ATTR_OF.UC.ALLC + '' + type + '' + id;
    },
    setUc: (u: string): string => {
        return "." + ATTR_OF.UC.UC_STAMP + "" + u;
    },
    setParent: (u: string): string => {
        return "." + ATTR_OF.UC.CLASS_PARENT + "" + u;
    }, setRoot: (u: string): string => {
        return "." + ATTR_OF.UC.CLASS_ROOT + "" + u;
    },
    getParent: (p: string, r: string): string[] => {
        return [ATTR_OF.UC.CLASS_PARENT + "" + p, ATTR_OF.UC.CLASS_ROOT + "" + r]
    },
    getUc: (u: string): string => {
        return ATTR_OF.UC.UC_STAMP + "" + u;
    },
    X_NAME: "x-name",
    X_FROM: "x-from",
    BASE_OBJECT: "base_object",
    SCOPE_KEY: "x-scope",
    ACCESSIBLE_KEY: "id",
    TEMPLETE_DEFAULT: "primary",
    UC: Object.freeze({
        ALLC: "c" + GetRandomNo(1,9999),
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

