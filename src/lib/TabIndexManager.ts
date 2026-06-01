
import { ucUtil } from "ap-shared-core/core.js";
import { WinManager } from "./WinManager.js";
interface TabIndexRow {
    container: HTMLElement;
    element: HTMLElement;
    tIndex: number;
}
type TabStatus = 'backword' | 'forward' | 'none';
class ErrorSound {
    static audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    static gainNode = (() => {
        const gain = ErrorSound.audioCtx.createGain();
        gain.connect(ErrorSound.audioCtx.destination);
        return gain;
    })();

    static playErrorBeep() {
        if (ErrorSound.audioCtx.state === 'suspended') {
            ErrorSound.audioCtx.resume();
        }

        const osc = ErrorSound.audioCtx.createOscillator();
        const gain = ErrorSound.audioCtx.createGain();

        osc.type = 'square';                 // Sharp, attention-catching
        osc.frequency.value = 140;           // Low pitch
        gain.gain.setValueAtTime(0.35, ErrorSound.audioCtx.currentTime);

        // Optional fade-out (smooth ending)
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ErrorSound.audioCtx.currentTime + 0.12
        );

        osc.connect(gain);
        gain.connect(ErrorSound.gainNode);

        osc.start(ErrorSound.audioCtx.currentTime);
        osc.stop(ErrorSound.audioCtx.currentTime + 0.15); // ~150ms

        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    }
}

export interface TabContainerClearNode { target: HTMLElement, callback: (e: KeyboardEvent) => Promise<boolean | void> }
class TabIndexManager {
    static beep() { ErrorSound.playErrorBeep(); }

    static stopFurther(e: Event, breakTheLoop: boolean = false) {
        if (e == undefined) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (breakTheLoop)
            TabIndexManager.breakTheLoop = true;
    }

    mainHT: HTMLElement | undefined;
    private static _music = false;
    public static get music() {
        return TabIndexManager._music;
    }
    public static set music(value) {
        TabIndexManager._music = value;
    }
    private static _breakTheLoop = false;
    public static get breakTheLoop() {
        return this._breakTheLoop;
    }
    public static set breakTheLoop(value) {
        this._breakTheLoop = value;

    }
    static continueusMove = async (container: HTMLElement, { startAt = undefined, stopAt = undefined }: { startAt?: HTMLElement, stopAt?: HTMLElement }) => {
        TabIndexManager.breakTheLoop = false;
        let callback: TabContainerClearNode = {
            target: container, callback: async () => { TabIndexManager.breakTheLoop = true; return true; }
        };
        this.Events.onContainerBottomLeave.push(callback);
        let activeElement = startAt == undefined ? container : startAt;
        let prevActEle = undefined;
        do {
            await this.moveNext(activeElement, undefined);
            if (TabIndexManager.breakTheLoop) { this.beep(); break; }
            if (activeElement === document.activeElement) TabIndexManager.breakTheLoop = true;
            activeElement = document.activeElement as HTMLElement;
            if (activeElement === stopAt || prevActEle == activeElement) TabIndexManager.breakTheLoop = true;
            prevActEle = activeElement;
        } while (!TabIndexManager.breakTheLoop);

        TabIndexManager.breakTheLoop = false;
        this.Events.onContainerBottomLeave["#RemoveMultiple"](callback);
    }
    
    static isDirectClose(child: HTMLElement, container: HTMLElement): boolean {
        return container == child.parentElement.closest(`[x-tabindex]`);
    }
    constructor() { }
    static Events = {

        onContainerTopLeave: [] as TabContainerClearNode[],
        onContainerTopEnter: [] as TabContainerClearNode[],
        onContainerBottomLeave: [] as TabContainerClearNode[],
        onContainerBottomEnter: [] as TabContainerClearNode[],


        NAVIGATE_NEXT_FIELD_FOCUS: async (ev: KeyboardEvent) => {
            if (ev.defaultPrevented) return;
            let _EVENT_target = ev.target;


            if (!ev.shiftKey) {
                await this.moveNext(_EVENT_target as HTMLElement, ev);
            } else {
                await this.movePrev(_EVENT_target as HTMLElement, ev);
            }
            this.status = 'none';
            ev.preventDefault();
            this.breakTheLoop = false;
        },
        NAVIGATE_PREV_FIELD_FOCUS: async (ev: KeyboardEvent) => {
            if (ev.defaultPrevented) return;
            const _EVENT_target = ev.target;
            let constructorName = Object.getPrototypeOf(_EVENT_target).constructor.name;

            switch (constructorName) {
                case HTMLTextAreaElement.name:
                case HTMLInputElement.name:
                    let ele = _EVENT_target as HTMLTextAreaElement & HTMLInputElement;
                    let _val = ele.value;
                    switch (ele.type) {
                        case undefined:  //  HTMLTextAreaElement
                        case "text":
                        case "password":
                        case "email":
                        case "search":
                        case "tel":
                        case "url":
                        case "number":
                        case "date":
                        case "datetime-local":
                        case "month":
                        case "week":
                        case "time":
                            if (_val == '' || _val == ucUtil._getSelectedValuee(ele)) {
                                await this.movePrev(_EVENT_target as HTMLElement, ev);
                                this.status = 'none';
                                ev.preventDefault();
                            }
                            break;
                        default:
                            await this.movePrev(_EVENT_target as HTMLElement, ev);
                            this.status = 'none';
                            ev.preventDefault();
                            break;
                    }
                    break;
                default:
                    await this.movePrev(_EVENT_target as HTMLElement, ev);
                    this.status = 'none';
                    ev.preventDefault();
                    break;
            }

            this.breakTheLoop = false;
        },
        NAVIGATE_LEFT_ITEM_FOCUS: async (ev: KeyboardEvent) => {
            if (ev.defaultPrevented) return;
            const htEle = ev.target as HTMLElement;
            const tIndex = this.getTindex(htEle);
            if (tIndex != null) {
                if (!this.ElementAvailability.FOCUSABLE_ELEMENTS.includes(htEle.nodeName) && htEle.contentEditable != "true") {
                    await this.movePrev(htEle, ev);
                    ev.preventDefault();
                }
            }
            this.breakTheLoop = false;
            //ev.preventDefault();
        },
        NAVIGATE_RIGHT_ITEM_FOCUS: async (ev: KeyboardEvent) => {
            if (ev.defaultPrevented) return;
            const htEle = ev.target as HTMLElement;
            const tIndex = this.getTindex(htEle);
            if (tIndex != null) {
                if (!this.ElementAvailability.FOCUSABLE_ELEMENTS.includes(htEle.nodeName) && htEle.contentEditable != "true") {
                    await this.moveNext(htEle, ev);
                    ev.preventDefault();
                }
            }
            this.breakTheLoop = false;
            //ev.preventDefault();
        },

    }
    static ElementAvailability = {
        isVisualyAppeared: (hte: HTMLElement) => {
            if (hte == undefined) return false;
            let isVisible = true;
            isVisible = ucUtil.currentStyles(hte).visibility == 'visible';
            return hte.offsetWidth > 0 && hte.offsetHeight > 0 && isVisible && hte.closest('[inert]') == null            
        },
        /**
         * add nodeName of HTMLElement in this array
         */
        FOCUSABLE_ELEMENTS: ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"],
        async IS_FOCUSABLE_ELEMENT(element: HTMLElement) {
            return (this.FOCUSABLE_ELEMENTS.includes(element.nodeName) ||
                element.contentEditable == 'true')
        },
        hasTabStop: (element: HTMLElement) => {
            if (element.hasAttribute('x-tabstop')) {
                const tabStop = element.getAttribute('x-tabstop');
                return (tabStop === `true` || tabStop == '1');
            }
            return false;
        }
    }
    private static isFocusableElement = async (hte: HTMLElement) => {
        const abailability = this.ElementAvailability;
        let isVisaulyAppeared = abailability.isVisualyAppeared(hte);
        if (!isVisaulyAppeared) return false;

        let element = hte as HTMLInputElement;
        let isPrimaryInputElements = await abailability.IS_FOCUSABLE_ELEMENT(element);
        if (!isPrimaryInputElements) {
            if (abailability.hasTabStop(element)) {
                element.tabIndex = -1;
                isPrimaryInputElements = true;
            }
        }
        return !element.disabled && isPrimaryInputElements;
    }
    static status: TabStatus = 'none';
    private static isInited = false;

    static init(/*mainHT: HTMLElement*/) {
        /*this.mainHT = mainHT;*/
        if (this.isInited) return;
        this.isInited = true;
        let htEle: HTMLElement | undefined;
        let tIndex: number;
        // this.gainNode.connect(this.audioCtx.destination);

        let keyDownTimer = null;
        let keyIsDown = false;



        WinManager.event.keydown.on(async (ev: KeyboardEvent) => {
            switch (ev.code) {
                /*case 'Backspace':
                    await TabIndexManager.Events.NAVIGATE_PREV_FIELD_FOCUS(ev);
                    break;
                case 'Enter':
                case 'NumpadEnter':*/
                case 'Tab':
                    await TabIndexManager.Events.NAVIGATE_NEXT_FIELD_FOCUS(ev);
                    break;
                /*case 'ArrowLeft':
                    await TabIndexManager.Events.NAVIGATE_LEFT_ITEM_FOCUS(ev);
                    break;
                case 'ArrowRight':
                    await TabIndexManager.Events.NAVIGATE_RIGHT_ITEM_FOCUS(ev);
                    break;*/
            }
        });
    }


    static movePrev = async (target: HTMLElement, ev: KeyboardEvent, goAhead: boolean = false) => {
        let _this = this;

        this.status = 'backword';
        let tIndex = parseInt(target.getAttribute('x-tabindex'));
        if (tIndex == null) return;
        if (goAhead) {
            tIndex--;
            if (tIndex == -1) { //  IF REACHED TO 0 TAB INDEX;
                let parent = this.getDirectParent(target);
                if (await this._HELLO_KON(parent, ev, this.Events.onContainerTopLeave)) return;
                /* let evt = this.Events.onContainerTopLeave;
                 let _obj = evt.find(s => s.target == parent);
                 if (_obj != undefined) if (_obj.callback() === true) return;*/
                await this.movePrev(parent, ev, true);
            } else if (tIndex < -1) {  //  IF IN THE AIR    ,-)
            } else {
                let parent = this.getDirectParent(target);
                let ele = this.getDirectElement(parent, tIndex) ?? this.getAnyPreviousBefore(parent, tIndex);
                if ((await this.isFocusableElement(ele))) {   // IF PREVIOUS ELEMENT IS TEXTBOX
                    this.focusTo(ele);
                } else {
                    if (ele !== undefined)
                        await this.movePrev(ele, ev);
                    else {
                        //let ele = this.getDirectParent(parent);
                        if ((await this._HELLO_KON(ele, ev, this.Events.onContainerTopLeave))) return;
                        // let evt = this.Events.onContainerTopLeave;
                        // let _obj = evt.find(s => s.target == parent);
                        // if (_obj != undefined) if (_obj.callback(ev) === true) return;
                        await this.movePrev(parent, ev, true);
                    }
                }
            }
        } else {
            let childLastElement = this.getLastElement(target);
            if (childLastElement == undefined) {  //  IF NO CHILD TAB INDEX AVALABLE
                await this.movePrev(target, ev, true);
            } else { //  IF CHILD TAB INDEX EXIST
                if ((await this._HELLO_KON(target, ev, this.Events.onContainerBottomEnter))) return;
                /*let evt = this.Events.onContainerBottomEnter;
                let _obj = evt.find(s => s.target == target);
                if (_obj != undefined) if (_obj.callback() === true) return;*/

                if ((await this.isFocusableElement(childLastElement))) {  //  IF LAST ELEMENT IS TEXTBOX
                    this.focusTo(childLastElement);
                } else {     //  MOVE TO PREVIOUS WITH CHECK
                    await this.movePrev(childLastElement, ev);
                }
            }
        }
    }

    static getLastElement(container: HTMLElement, index = -Infinity): HTMLElement {
        /*  let i = 0;
        let lastEle: HTMLElement;
        do {
            let ele = this.getDirectElement(container, i);
            if (ele == undefined) break;
            lastEle = ele;
            i++;
        } while (true);
        return lastEle; */
        let maxEl = undefined;
        let maxValue = index;

        const elements = container.querySelectorAll('[x-tabindex]');

        for (const el of elements) {
            const nearestTabParent = el.parentElement?.closest('[x-tabindex]');
            if (nearestTabParent === container) {
                const val = Number(el.getAttribute('x-tabindex'));
                if (!Number.isNaN(val) && val > maxValue) {
                    maxValue = val;
                    maxEl = el;
                }
            }
        }

        return maxEl;

    }
    static getFirstElement(container: HTMLElement, index = Infinity): HTMLElement {
        let minEl = undefined;
        let minValue = index;
        const elements = container.querySelectorAll('[x-tabindex]');
        for (const el of elements) {
            const nearestTabParent = el.parentElement?.closest('[x-tabindex]');
            if (nearestTabParent === container) {
                const val = Number(el.getAttribute('x-tabindex'));
                if (!Number.isNaN(val) && val < minValue) {
                    minValue = val;
                    minEl = el;
                }
            }
        }
        return minEl;
    }

    static getAnyNextAfter(container: HTMLElement, currentIndex: number) {
        let nextEl = undefined;
        let nextValue = Infinity;

        const elements = container.querySelectorAll('[x-tabindex]');

        for (const el of elements) {
            const nearestTabParent = el.parentElement?.closest('[x-tabindex]');
            if (nearestTabParent === container) {
                const val = Number(el.getAttribute('x-tabindex'));
                if (!Number.isNaN(val) && val > currentIndex && val < nextValue) {
                    nextValue = val;
                    nextEl = el;
                }
            }
        }

        return nextEl;
    }
    static getAnyPreviousBefore(container: HTMLElement, currentIndex: number) {
        let prevEl = undefined;
        let prevValue = -Infinity;
        const elements = container.querySelectorAll('[x-tabindex]');
        for (const el of elements) {
            const nearestTabParent = el.parentElement?.closest('[x-tabindex]');
            if (nearestTabParent === container) {
                const val = Number(el.getAttribute('x-tabindex'));
                if (!Number.isNaN(val) && val < currentIndex && val > prevValue) {
                    prevValue = val;
                    prevEl = el;
                }
            }
        }

        return prevEl;
    }
    static SKIP_CONTAINER_EVENTS = false;
    static _HELLO_KON = async (ele: HTMLElement, e: KeyboardEvent, cnt: TabContainerClearNode[]): Promise<boolean> => {
        let res = false;
        if (TabIndexManager.breakTheLoop || TabIndexManager.SKIP_CONTAINER_EVENTS) return true;
        for (let i = 0, len = cnt.length; i < len; i++) {
            let nd = cnt[i];
            if (nd.target != undefined && ele == nd.target) {
                //TabIndexManager.breakTheLoop = true;
                res = await nd.callback(e) === true;

                break;
            }
        }

        return res;
    }


    static moveNext = async (target: HTMLElement, ev: KeyboardEvent, goAhead: boolean = false,) => {
        let _this = this;
        //debugger;
        this.status = 'forward';
        if (!target.isConnected) return;
        let tIndex = parseInt(target.getAttribute('x-tabindex'));
        if (tIndex == null) return;
        if (!this.ElementAvailability.isVisualyAppeared(target))
            goAhead = true;

        if (goAhead && (await this._HELLO_KON(target, ev, this.Events.onContainerBottomLeave))) return;
        //  if (this._HELLO_KON(target, this.Events.onContainerTopEnter)) return;  //  <------ REMOVE THIS CODE IF ANY BUG
        let childFirstElement = goAhead ? undefined : this.getDirectElement(target, 0) ?? this.getAnyNextAfter(target, 0);
        if (childFirstElement != undefined) { // IF FIRST CHILD TAB-INDEX EXIST
            if ((await this._HELLO_KON(childFirstElement, ev, this.Events.onContainerTopEnter))) return;
            /*let evt = this.Events.onContainerTopEnter;
            let _obj = evt.find(s => s.target == childFirstElement);
            if (_obj != undefined) if (_obj.callback() === true) return;*/

            if ((await this.isFocusableElement(childFirstElement))) { // IF FIRST CHILD IS TEXTBOX
                this.focusTo(childFirstElement);
            } else {   // GO TO NEXT TAB-INDEX
                await this.moveNext(childFirstElement, ev);
            }
        } else {       // GO TO NEXT TAB-INDEX
            tIndex++;
            let parent = this.getDirectParent(target);
            if (parent == null) return;
            // debugger;
            let ele = this.getDirectElement(parent, tIndex) ?? this.getAnyNextAfter(parent, tIndex);
            if ((await this._HELLO_KON(ele, ev, this.Events.onContainerTopEnter))) return;
            if ((await this.isFocusableElement(ele))) {   // IF NEXT ELEMENT IS TEXTBOX
                this.focusTo(ele);
            } else {    // IF NEXT ELEMENT HAS CHILD ELEMENT
                if (ele != undefined) { // IF NEXT ELEMENT EXIST      

                    await this.moveNext(ele, ev);
                } else { // ELSE
                    //if (this._HELLO_KON(parent, this.Events.onContainerBottomLeave)) return;
                    /* let evt = this.Events.onContainerBottomLeave;
                     let _obj = evt.find(s => s.target == parent);
                     if (_obj != undefined) if (_obj.callback() === true) return;*/
                    await this.moveNext(parent, ev, true);   // GO TO PARENT CONTAINER AND MOVE NEXT TAB-INDEX
                }
            }
        }
    }

    static getDirectParent(element) { return this.getClosest(element); }
    static getDirectElement(container: HTMLElement, index: number): HTMLElement {
        let ar = Array.from(container.querySelectorAll(`[x-tabindex="${index}"]`));
        ar = ar.filter(s => container === this.getClosest(s)) as HTMLElement[];
        return ar[0] as HTMLElement;
    }

    static focusTo(htele: HTMLElement) {
        this.status = 'none';
        if (this.breakTheLoop) {
            if (this.music)
                this.beep();
            this.music = this.breakTheLoop = this.SKIP_CONTAINER_EVENTS = false;
            return;
        }
        htele.focus();
        ucUtil.selectAllText(htele);
    }

    static getTindex(target: HTMLElement): number | null {
        if (target == undefined) return null;
        let tIndex = target.getAttribute('x-tabindex');
        return (tIndex == null) ? null : parseInt(tIndex);
    }

    static getClosest(target: HTMLElement | Element): HTMLElement | null {
        //if (target.parentElement == undefined) debugger;
        return target.parentElement?.closest("[x-tabindex]");
    }




}

const elementState = Object.freeze({
    Undefined: 0,
    Editable: 1,
    Disabled: 2,
    Container: 3,
});

export { TabIndexManager };

