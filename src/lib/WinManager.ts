import { GetUniqueId, KeyboardKey } from 'ap-shared-core/core-common.js';
import { CommonEvent } from "../global/commonEvent.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
import { TabIndexManager } from "./TabIndexManager.js";

interface WinNode {
    uc?: Usercontrol,
    display?: string,
    lastFocusedAt?: HTMLElement
}
export class FocusManager {
    currentElement: HTMLElement | undefined;
    Event = {
        onFatch: new CommonEvent<(ele: HTMLElement) => void>(),
        onFocus: new CommonEvent<(ele: HTMLElement) => void>(),
    }
    fetch = async (ele: HTMLElement) => {
        this.currentElement = undefined;
        //console.log(ele);

        this.currentElement = ele ?? document.activeElement as HTMLElement;
        this.Event.onFatch.fireAsync([this.currentElement]);
        //this.currentElement.fireEvent('blur');
    }
    /**
     * 
     * @param containerElement if last focused element not insde `contaierElement` than direct focus to `containerElement`
     */
    focus = async (containerElement?: HTMLElement) => {
        if (containerElement != undefined && !containerElement.contains(this.currentElement)) {
            if (containerElement.hasAttribute('tabindex')) {
                await TabIndexManager.focusTo(containerElement);
            } else {
                await TabIndexManager.moveNext(containerElement, undefined);
            }
        } else {
            if (this.currentElement == undefined) return;
            await TabIndexManager.focusTo(this.currentElement);
        }
        await this.Event.onFocus.fireAsync([this.currentElement]);
    }
}

export class WinManager {
    static IS_REPEAT = false;
    static RepeatPauseInMilliSeconds = 1000;
    static isSameKey = <T>(arr1: T[], arr2: T[]): boolean => {
        if (arr1.length !== arr2.length) return false; // lengths must be same
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false; // check each element
        }
        return true;
    }

    static initEvent() {
        const _this = this;
        //.log('======================>WinManager.initEvent');


        window.addEventListener('keydown', async (e) => {
            if (WinManager.IS_REPEAT || e.code == undefined) return;
            if (e.repeat) WinManager.IS_REPEAT = true;
            await _this.event.keydown.fireAsync([e]);
            //requestAnimationFrame(() => {
            WinManager.IS_REPEAT = false;
            //}, WinManager.RepeatPauseInMilliSeconds)

        });
        window.addEventListener('keyup', async (e) => {
            WinManager.IS_REPEAT = false;
            if (e.code == undefined) return;
            await _this.event.keyup.fireAsync([e]);
        });
    }
    static event = {
        // onFreez: (uc: Usercontrol) => {

        // },
        // onUnFreez: (uc: Usercontrol) => {

        // },
        onFreez: new CommonEvent<(uc: Usercontrol) => Promise<void>>(),
        onUnFreez: new CommonEvent<(uc: Usercontrol) => Promise<void>>(),
        keydown: new CommonEvent<(e: KeyboardEvent) => Promise<void>>(),
        keyup: new CommonEvent<(e: KeyboardEvent) => Promise<void>>(),

    }
    static ACCESS_KEY = 'WinManager_' + GetUniqueId();
    static getNode(htNode: HTMLElement): WinNode { return htNode["#data"](WinManager.ACCESS_KEY); }
    static setNode(htNode: HTMLElement): WinNode {
        const dta: WinNode = {};
        dta.uc = Usercontrol.parse(htNode);
        htNode["#data"](WinManager.ACCESS_KEY, dta);
        return dta;
    }
    static focusMng: FocusManager = new FocusManager();
    static push = async (form: Usercontrol) => {
        let _this = this;
        const mainHT = form.ucExtends.wrapperHT;
        if (form.ucExtends.isForm) {
            const prevNode = mainHT.previousElementSibling as HTMLElement;
            if (prevNode != null) {
                const wn = WinManager.getNode(prevNode) ?? WinManager.setNode(prevNode);
                const activeElement = wn.uc.ucExtends.lastFocuedElement;// document.activeElement;

                if (prevNode.contains(activeElement))
                    wn.lastFocusedAt = activeElement as any;
                wn.display = prevNode.style.display;
                await form.ucExtends.Events.beforeUnFreez.fireAsync([wn?.uc]);
                await this.setfreez(true, wn/*, doStyleDisplay*/);
            }

        }
        await form.ucExtends.Events.activate.fireAsync([]);
    }

    static pop = async (form: Usercontrol) => {
        await form?.ucExtends.Events.deactivate.fireAsync([]);
        const freezedHT = form.ucExtends.wrapperHT.previousElementSibling as HTMLElement;
        if (freezedHT != undefined) {
            const wn = WinManager.getNode(freezedHT);
            if (wn != undefined) {
                await this.setfreez(false, wn/*, res*/);
            }
        }
    }

    static ATTR = {
        DISABLE: {
            NEW_VALUE: "disnval" + GetUniqueId(),
            OLD_VALUE: "disoval" + GetUniqueId(),
        },
        INERT: {
            NEW_VALUE: "inrtnval" + GetUniqueId(),
            OLD_VALUE: "inrtoval" + GetUniqueId(),
        }
    }

    static setfreez = async (freez: boolean, wnode: WinNode/*, handeledDisplay: boolean*/) => {
        const uc = wnode.uc;
        const element = uc.ucExtends.wrapperHT;
        if (freez) {
            await this.event.onFreez.fireAsync([uc]);
            await this.focusMng.fetch(uc.ucExtends.lastFocuedElement);
            wnode.lastFocusedAt = this.focusMng.currentElement;
            wnode.display = element.style.display;

            await uc.ucExtends.Events.deactivate.fireAsync([]);
            await this.FreezThese(true, element);
            //if (!uc.ucExtends.keepVisible) element.style.display = 'none';
        } else {
            await this.event.onUnFreez.fireAsync([uc]);
            await this.FreezThese(false, element);
            element.style.display = wnode.display;
            this.focusMng.currentElement = wnode.lastFocusedAt;
            await this.focusMng.focus(element);
            await uc.ucExtends.Events.activate.fireAsync([]);
        }
    }

    static async FreezThese(freez: boolean, ...elements: HTMLElement[]) {
        if (freez) {
            for (let i = 0, ilen = elements.length; i < ilen; i++) {
                const element = elements[i];
                let inertAttr = element.getAttribute("inert");
                if (inertAttr != null) element["#data"](WinManager.ATTR.INERT.OLD_VALUE, inertAttr);
                element.setAttribute('inert', 'true');
            }
        } else {
            for (let i = 0, ilen = elements.length; i < ilen; i++) {
                const element = elements[i];
                element.setAttribute('active', '1');
                let inertAttr = element["#data"](WinManager.ATTR.INERT.OLD_VALUE);
                if (inertAttr != undefined) element.setAttribute('inert', inertAttr);
                else element.removeAttribute('inert');
            }
        }
    }


    static captureElementAsImage(element: HTMLElement) {
        // const element = document.getElementById(elementId);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set canvas dimensions to match the element
        canvas.width = element.offsetWidth;
        canvas.height = element.offsetHeight;

        // Draw the element onto the canvas
        ctx.drawImage(element as CanvasImageSource, 0, 0);
        // Get the image data as a data URL
        const imageData = canvas.toDataURL('image/png');
        return imageData;
    }

}
