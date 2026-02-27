import { GetUniqueId } from "ap-shared-core/core-common.js";

 


export class dataManager {
    //source: {} = {};
    //map: {} = {};
    static ATTR = {
        DM_DATA: "dm" + GetUniqueId(),
    };
    eventIncrementId: number = 0;
    elementIncrementId: number = 1;

    getId = (element: HTMLElement): rowInfo => {
        let row: rowInfo = element[dataManager.ATTR.DM_DATA];
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

    getData(targetObject: HTMLElement, key?: string): any {
        let row: rowInfo = this.getId(targetObject);
        switch (arguments.length) {
            case 2:
                return row.data[key];
            case 1:
                return row.data;
            default:
                return row;
        }
    }

    setData(targetObject: HTMLElement, key: string, value?: any): void {
        let row: rowInfo = this.getId(targetObject);
        switch (arguments.length) {
            case 3:
                row.data[key] = value;
                break;
            case 2:
                row.data = value;
                break;
        }
    }


    initElement(target: HTMLElement & HTMLElement[]): void {
        if (target.length == undefined) {
            [target, target.querySelectorAll('*')].forEach((ele) => {
                this.getId(ele as HTMLElement);
            });
        } else {
            for (let i = 0, iObj = target, ilen = iObj.length; i < ilen; i++) {
                target = iObj[i] as any;
                [target, target.querySelectorAll('*')].forEach((ele) => {
                    this.getId(ele as HTMLElement);
                });

            }

        }
    }
}
export class rowInfo {
    id: string = "";
    data: {} = {};
    event: { [key: string]: {}; } = {};
}

