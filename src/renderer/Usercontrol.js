import { ATTR_OF, GetUniqueId } from "ap-shared-core/out/uc-runtime/ucUtil.js";
import { ExtractArguments } from "../common/enumAndMore.js";
import { UserControl$Extended } from "./UsercontrolRes/UserControl$Extended.js";
export class Usercontrol {
    static guid;
    static MATERIAL = {
        htmlGuid: undefined,
        cssGuid: undefined,
    };
    static parse(node) { return node["#data"](ATTR_OF.BASE_OBJECT); }
    static HiddenSpace = document.createElement('hspc' + GetUniqueId());
    static UcOptionsStc;
    static extractArgs = (args) => ExtractArguments(args);
    constructor() {
        this.ucExtends = new UserControl$Extended();
        this.ucExtends.init(this);
    }
    static templateMkr = new Map();
    ucExtends;
}
//# sourceMappingURL=Usercontrol.js.map