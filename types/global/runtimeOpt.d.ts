export type StyleClassScopeType = "l" | "m" | "r" | "g";
export declare const GLOBAL_OPTIONS: {
    tabindexes: {
        allowTabInAllForms: boolean;
    };
};
export declare const ATTR_OF: {
    __CLASS: (id: string, type: StyleClassScopeType) => string;
    setUc: (u: string) => string;
    setParent: (u: string) => string;
    setRoot: (u: string) => string;
    getParent: (p: string, r: string) => string[];
    getUc: (u: string) => string;
    X_NAME: string;
    X_FROM: string;
    BASE_OBJECT: string;
    SCOPE_KEY: string;
    ACCESSIBLE_KEY: string;
    TEMPLETE_DEFAULT: string;
    UC: Readonly<{
        ALLC: string;
        ALL: string;
        UC_STAMP: string;
        CLASS_PARENT: string;
        CLASS_ROOT: string;
        CSSStyleDeclarations: string;
    }>;
};
