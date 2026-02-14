import { GetUniqueId } from "ap-shared-core/out/uc-control/ucUtil.js";
export class dataManager {
    //source: {} = {};
    //map: {} = {};
    static ATTR = {
        DM_DATA: "dm" + GetUniqueId(),
    };
    eventIncrementId = 0;
    elementIncrementId = 1;
    getId = (element) => {
        let row = element[dataManager.ATTR.DM_DATA];
        if (row == undefined) {
            this.elementIncrementId++;
            let _id = "id_" + this.elementIncrementId;
            row = new rowInfo();
            row.id = _id;
            element[dataManager.ATTR.DM_DATA] = row;
        }
        return row;
    };
    /* fillObjectRef(targetObject: HTMLElement, arr: string[]): void {
         arr.push(this.getId(targetObject).id);
         for (let i = 0, iObj = targetObject.children, ilen = iObj.length; i < ilen; i++) {
             const iItem = iObj[i];
             this.fillObjectRef(iItem as HTMLElement, arr);
         }
         //looping.htmlChildren(targetObject, s => this.fillObjectRef(s, arr));
     }
 
     deleteObjectRef(targetObject: HTMLElement): void {
         //console.log('deleting.,');
         let keylist: string[] = [];
         this.fillObjectRef(targetObject, keylist);
         keylist.forEach(e => delete this.source[e]);
     }*/
    getData(targetObject, key) {
        let row = this.getId(targetObject);
        switch (arguments.length) {
            case 2:
                return row.data[key];
            case 1:
                return row.data;
            default:
                return row;
        }
    }
    setData(targetObject, key, value) {
        let row = this.getId(targetObject);
        switch (arguments.length) {
            case 3:
                row.data[key] = value;
                break;
            case 2:
                row.data = value;
                break;
        }
    }
    initElement(target) {
        if (target.length == undefined) {
            [target, target.querySelectorAll('*')].forEach((ele) => {
                this.getId(ele);
            });
        }
        else {
            for (let i = 0, iObj = target, ilen = iObj.length; i < ilen; i++) {
                target = iObj[i];
                [target, target.querySelectorAll('*')].forEach((ele) => {
                    this.getId(ele);
                });
            }
        }
    }
}
export class rowInfo {
    id = "";
    data = {};
    event = {};
}
//# sourceMappingURL=dataManager.js.map