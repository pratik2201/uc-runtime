import path from "path";
import { PathReplacer } from "./fileWatcher.enums.js";

export class fileWatcherNew {
    pathReplace: PathReplacer[]; 
    projectRoot = path.resolve();
    constructor() {

    }
}