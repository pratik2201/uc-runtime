import { Usercontrol } from "../Usercontrol.js";
type ResultCallback = (returnedValue: any) => boolean;
type Parameter<T> = T extends (...arg: infer T) => any ? T : never;
export declare class CommonEvent<F extends (...arg: any) => void> {
    isSingleEvent: boolean;
    Events: {
        onChangeEventList: () => void;
        afterFireCallbacks: () => void;
    };
    private _eventList;
    private _onCounter;
    get onCounter(): number;
    private set onCounter(value);
    constructor(isSingleEvent?: boolean);
    private static STAMP_KEY;
    private static STAMP_NO;
    static get nStamp(): string;
    /**
     *
     * @param callback
     * @param uc give usercontrol reference if want to remove event from event caller list when given `Usercontrol` close
     * @param stamp
     * @returns
     */
    on(callback: F, uc?: Usercontrol, makeSureOnlyOneCallbackShouldUse?: boolean, stamp?: string): string;
    removeByStamp(stamp: string): void;
    off(callback: Function): void;
    get length(): number;
    /**
     * @returns `true` if any of callback from list returned `true`
     */
    fire(args: Parameter<F> | void): boolean;
    fireAsync(args: Parameter<F> | void): Promise<boolean>;
    fireWithResult(_resultCallback?: ResultCallback): boolean;
    clear(): void;
}
export {};
