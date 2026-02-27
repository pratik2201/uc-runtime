export const UC_ACCESS_KEY = '_____UC____';
export class PreloadFullFill {
    url = {
        fileURLToPath: undefined,
        pathToFileURL: undefined,
    };
    path = {
        extname: undefined,
        isAbsolute: undefined,
        basename: undefined,
        relative: undefined,
        dirname: undefined,
        sep: undefined,
        normalize: undefined,
        join: undefined,
        resolve: undefined,
    };
}
export function IPC_GET_KEY(actionKey, regKey) {
    return actionKey + ";" + regKey;
}
export function IPC_SPLIT_KEY(actionKey) {
    let rtrn = actionKey.split(';');
    return { action: rtrn[0], regKey: rtrn[1] };
}
//# sourceMappingURL=enumAndMore.js.map