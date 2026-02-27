import { decryptResource, encryptResource } from "ap-shared-core/out/uc-runtime/resources/cryptoResource.js";
import { IpcMainGroup } from "./ipc/IpcMainHelper.js";
import { ResourceStorage } from "./ResourceStorage.js";
export default function () {
    const main = IpcMainGroup('ucbuilder/src/renderer/ResourceManage');
    main.On('x1', (event, res) => {
        event.returnValue = encryptResource(res);
    });
    main.On('x0', (event, res) => {
        event.returnValue = decryptResource(res);
    });
    main.On('register', (event, res) => {
        event.returnValue = ResourceStorage.register(res);
    });
    main.On('bulkRegister', (event, list) => {
        event.returnValue = ResourceStorage.bulkRegister(list);
    });
    main.On('has', (event, key) => {
        event.returnValue = ResourceStorage.has(key);
    });
    main.On('get', (event, key) => {
        event.returnValue = ResourceStorage.get(key);
    });
    main.On('getContent', (event, key) => {
        event.returnValue = ResourceStorage.getContent(key);
    });
    main.On('getByName', (event, name) => {
        event.returnValue = ResourceStorage.getByName(name);
    });
    main.On('getContentByName', (event, name) => {
        event.returnValue = ResourceStorage.getContentByName(name);
    });
    main.On('keys', (event) => {
        event.returnValue = ResourceStorage.keys();
    });
    main.On('clear', (event) => {
        event.returnValue = ResourceStorage.clear();
    });
}
;
//# sourceMappingURL=ResourceManage.ipc.js.map