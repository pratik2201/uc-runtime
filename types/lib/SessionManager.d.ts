import { SessionOptions } from "../enumAndMore.js";
import { Usercontrol } from "../Usercontrol.js";
export declare class SessionManager {
    varName: string;
    fStamp: string;
    options: SessionOptions;
    main: Usercontrol | undefined;
    ucExt: any;
    dataPath: string;
    init(main: Usercontrol, options: SessionOptions, uniqIdentity?: string): void;
    prepareForAutoLoadIfExist(): void;
    varify: (newSession: any) => boolean;
    parentSource: any;
    callmeOnNextexParent: any;
    exchangeParentWith(newParent: any, callmeOnNextexParent?: any): void;
    autoLoadSession: boolean;
    _source: any;
    get source(): any;
    set source(val: any);
    setSession(src: any): boolean;
    getSession(): any;
    has(key: string): boolean;
    get(key?: string): any;
    set(key: string, value: any): void;
    onModify(): void;
    readfile(fPath?: string): boolean;
    writeFile(): void;
}
