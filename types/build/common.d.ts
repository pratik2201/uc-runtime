export declare const numOpt: {
    addFloat(actualNum: number): number;
    gtv(ifBeingThis: number, equalToThis: number, thanHowMuchAboutThis: number): number;
    getThirdValue(ifBeingThis: number, equalToThis: number, thanHowMuchAboutThis: number): number;
    gtvc(ifBeingThis: number, equalToThis: number, thanHowMuchAboutThis: number): number;
    getThirdValueCheck(ifBeingThis: number, equalToThis: number, thanHowMuchAboutThis: number): number;
    SafeDivision(Numerator: number, Denominator: number): number;
};
export declare const strOpt: {
    getBool(str: string, defValue?: boolean): boolean;
    cleanTextForRegs(text: string): string;
    replaceAll(source: string, textToFind: string, replaceWith: string): string;
    encode_utf8(s: string): string;
    decode_utf8(s: string): string;
    _trim(source: string, charlist?: string): string;
    trim_(source: string, ...charlist: string[]): string;
    __trim(source: string, charlist?: string): string;
    trim__(source: string, charlist?: string): string;
};
export declare const arrayOpt: {
    pushRange<T>(currentArr: T[], elementToPush: T[], atPosition: number): void;
    removeAt<T>(source: T[], deleteIndex: number | number[]): T[];
    moveElement<T>(arr: T[], old_index: number, new_index: number): T[];
    removeByCallback<T>(arr: T[], callback: (ele: T) => boolean): T[];
    Max<T>(array: T[], propName: string): number;
};
export declare const looping: {
    removeFromArray<T>(arr: T[], callback?: (ele: T) => boolean): T[];
    kvp(obj: object, callback: (k: string, v: any) => void): void;
    iterateArray<T>(ar: T[], callback?: (ele: T) => boolean): boolean;
    filterJson<T>(jData: T[], eachCalback: (row: T, index: number) => boolean): T[];
    htmlChildren(htEle: HTMLElement, eachCalback: (row: HTMLElement, index: number) => void): void;
};
export declare const propOpt: {
    hasAttr(attr: any): boolean;
    getMaxAttr($selector: any, attrib?: string): number;
};
export declare const controlOpt: {
    ATTR: {
        editableControls: string;
    };
    type: {
        usercontrol: string;
        form: string;
    };
    hasFocus($ele: any): boolean;
    hasClosingTag: (tagName: HTMLElement | string) => boolean;
    selectAllText(elem: HTMLElement): void;
    setProcessCSS(styleName: string, value: string): void;
    getSeletectedText(elem: HTMLElement): string | null;
    wrap(srcEle: HTMLElement, wrapin: HTMLElement | string): HTMLElement;
    unwrap(wrapper: HTMLElement): HTMLElement[];
    getArray: (obj: any) => any[];
    xPropToAttr(elementHT: HTMLElement): string;
    renameTag(sourceTag: HTMLElement, newName: string): HTMLElement;
    TextNodeToElement(textNode: Node): void;
    sizing: {
        getFullHeight(elestyle: CSSStyleDeclaration): number;
        getFullWidth(elestyle: CSSStyleDeclaration): number;
    };
};
export declare const objectOpt: {
    setChildValueByNameSpace(obj: object, namespace: string, valToAssign: any): boolean;
    getKeyFromObject(obj: Object, ar: string): string | undefined;
    parse(obj: object, isOfthisClass: string): boolean;
    assign(to: object, from: object): void;
    emptyObject(obj: object): void;
    clone<T>(obj: T): T;
    deepClone1<T>(obj: T): T;
    getValByNameSpace(obj: object, str: string): object;
    getParentClass(obj: object): object;
    getClassName(obj: any): string;
    has(key: string, obj: object): boolean;
};
export type ScopeType = "private" | "protected" | "package" | "public";
export declare const buildOptions: {
    ignoreDirs: string[];
};
