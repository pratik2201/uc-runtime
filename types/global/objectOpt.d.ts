export declare class newObjectOpt {
    /**
     * this will read `package.json` file from project's root directory and return project name
     * @param dirpath pass project's root directory path
     * @returns
     */
    static getProjectname(dirpath: string): string | undefined;
    static copyProps<T = Object>(from: T, to: T): T;
    static recursiveProp(from: Object, to: Object): void;
    static clone<T>(obj: T): T;
    static copyAttr(from: HTMLElement, to: HTMLElement): void;
    static getClassName(obj: object): string;
    static analysisObject(obj: object): {
        key: string;
        value: object;
        type: string;
    }[];
}
