interface EventTarget {
    ["#clearUcStyleClasses"](): void,
    ["#copyUcStyleClassesTo"](...eles: HTMLElement[] & any[]): void,
    ["#delete"](): void,
    ["#data"](): any;
    ["#data"](key: string): any;
    ["#data"](key: string, val: any): void;
    ["#data"](key?: string, value?: any): any
   }
interface Window {
    env: {
        NODE_ENV: string
    }
}
interface Object {
    ["#getType"](): string | undefined
}
interface HTMLElement extends EventTarget { }
interface Element extends EventTarget { }
interface HTMLInputElement {
    // set maskedValue(value: string),
    // get maskedValue(): string,
}
interface HTMLTextAreaElement extends HTMLInputElement {
}
interface SVGElement {
    ["#data"](key?: string, value?: any): any
}
interface Number {
    ["#toAlphabate"](): string
}
interface String {
    ["#$"](): HTMLElement & HTMLElement[],
    
    /**
     * @param trim default `true` this will remove first and last '/' from this string
     */
    ["#toFilePath"](trim?: boolean): string,
    ["#removeExtension"](extList?: string[]): string,
    ["#replaceAllWithResult"](find: string, replace: string): { result: string, hasReplaced: boolean },
    ["#escapeRegs"](): string,
    ["#getDriveFromPath"](): string | undefined,
    ["#_trim"](charlist?: string): string,
    ["#_trimText"](charlist?: string): string,
    ["#trimText_"](charlist?: string): string,
    ["#trim_"](charlist?: string): string,
    ["#_trim_"](charlist?: string): string,
    ["#__"](jsonRow: {}): string, 
    ["#startsWithI"](s: string): boolean,
    ["#endsWithI"](s: string): boolean,
    ["#includesI"](s: string): { result: boolean, index: number },
    ["#devEsc"](): string, 
    ["#PHP_REMOVE"](): string,
    ["#PHP_ADD"](): string,
}


interface NodeList {
    ["#on"]<K extends keyof HTMLElementEventMap>(eventList: K, handlerCallback: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void,
}
interface Array<T> {
    ["#on"]<K extends keyof HTMLElementEventMap>(eventList: K, handlerCallback: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any): void,
    ["#fillInto"]: (target: Array<T>, clearTarget?: boolean) => void,
    ["#fillIntoMultiple"]: (target: Array<Array<T>>, clearTarget?: boolean) => void,
    ["#distinct"](): T[],
    /**
     * @param Eles elements to remove
     * @returns removed elements
     */
    ["#RemoveMultiple"](...Eles: T[]): T[],
    /**
    * @param indexes indexes of elements to remove
    * @returns removed elements
    */
    ["#RemoveAtMultiple"](...indexes: number[]): T[],


    ["#RemoveByFilter"](callback: (row: T) => boolean),
}
interface JQuery {
    ["#css"](args: any): void,
    ["#position"](): { left: number, top: number },
    ["#height"](): number,
    ["#width"](): number,

}