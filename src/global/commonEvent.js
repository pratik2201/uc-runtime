import { GetUniqueId } from "ap-shared-core/out/uc-control/ucUtil.js";
const eventRecord = {
    callback: () => { },
    stamp: '',
};
const resultCallback = (returnedValue) => false;
export class CommonEvent {
    isSingleEvent = false;
    Events = {
        onChangeEventList: () => { },
        afterFireCallbacks: () => { }
    };
    _eventList = [];
    _onCounter = 0;
    get onCounter() {
        return this._onCounter;
    }
    set onCounter(value) {
        this._onCounter = value;
    }
    constructor(isSingleEvent = false) {
        this.isSingleEvent = isSingleEvent;
    }
    static STAMP_KEY = `CommonEvent_${GetUniqueId()}`;
    static STAMP_NO = 0;
    static get nStamp() { return CommonEvent.STAMP_KEY + ":" + (CommonEvent.STAMP_NO++); }
    /**
     *
     * @param callback
     * @param uc give usercontrol reference if want to remove event from event caller list when given `Usercontrol` close
     * @param stamp
     * @returns
     */
    on(callback, uc, makeSureOnlyOneCallbackShouldUse = false, stamp = CommonEvent.nStamp) {
        if (this.isSingleEvent)
            this._eventList = [];
        this.onCounter++;
        let index = this._eventList.length;
        let _this = this;
        if (makeSureOnlyOneCallbackShouldUse && this._eventList.findIndex(s => s.callback === callback) != -1)
            return;
        this._eventList.push({
            callback: callback,
            stamp: stamp
        });
        if (uc != undefined) {
            uc.ucExtends.Events.afterClose.on(() => {
                _this._eventList.splice(index, 1);
                _this.onCounter--;
                _this.Events.onChangeEventList();
            }, undefined);
        }
        this.Events.onChangeEventList();
        return stamp;
    }
    removeByStamp(stamp) {
        let fIndex = this._eventList.findIndex(s => s.stamp === stamp);
        if (fIndex != -1) {
            // arrayOpt.removeAt(this._eventList, fIndex);
            this._eventList.splice(fIndex, 1);
            this.Events.onChangeEventList();
        }
    }
    off(callback) {
        let fEvent = this._eventList.findIndex(s => s.callback === callback);
        if (fEvent != -1) {
            this._eventList.splice(fEvent, 1);
            //this._eventList["#RemoveMultiple"](fEvent);
            this.Events.onChangeEventList();
        }
    }
    get length() {
        return this._eventList.length;
    }
    /**
     * @returns `true` if any of callback from list returned `true`
     */
    fire(args) {
        let elist = this._eventList;
        let handeled = false;
        for (let i = 0, len = elist.length; i < len; i++) {
            const s = elist[i];
            let rval = s.callback.apply(this, args);
            if (rval === true) {
                handeled = true;
                break;
            }
        }
        this.Events.afterFireCallbacks();
        return handeled;
    }
    async fireAsync(args) {
        let elist = this._eventList;
        let handeled = false;
        for (let i = 0, len = elist.length; i < len; i++) {
            const s = elist[i];
            let rval = await s.callback.apply(this, args);
            if (rval === true) {
                handeled = true;
                break;
            }
        }
        this.Events.afterFireCallbacks();
        return handeled;
    }
    fireWithResult(_resultCallback = resultCallback) {
        let ar = Array.from(arguments);
        ar.shift();
        for (let i = 0; i < this._eventList.length; i++) {
            let s = this._eventList[i];
            if (_resultCallback(s.callback(...ar)) === true)
                return true;
        }
        return false;
    }
    clear() {
        this._eventList = [];
        this.Events.onChangeEventList();
    }
}
//# sourceMappingURL=commonEvent.js.map