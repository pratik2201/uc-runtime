export declare class patternMatcher {
    prePattern: RegExp;
    centerPattern: RegExp;
    postPattern: RegExp;
    pattern: RegExp;
    constructor(prePattern: RegExp, centerPattern: RegExp, postPattern: RegExp);
    concatRegexp(): void;
}
