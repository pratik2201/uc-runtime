
export class PathReplacer {
    pattern: RegExp;
    argsCount: number;
    callback: (...args: string[]) => boolean = (...args: string[]) => { return false; }
}