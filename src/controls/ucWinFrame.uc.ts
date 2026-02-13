import { ucWinFrame$Designer } from "../designerFiles/controls/ucWinFrame.uc.designer.js";

export class ucWinFrame extends ucWinFrame$Designer {

    async $() {
        const parentExt = this.ucExtends.PARENT.ucExtends;
        this.ucExtends.initalComponents.changeStage(this.container1);
        parentExt.initalComponents.stageHT = this.container1;
        this.lbl_title.innerText = parentExt.wrapperHT.getAttribute('x-caption') ?? '';
        this.cmd_close.addEventListener('mousedown', (e) => {
            e.preventDefault();
            parentExt.close();
        });

        this.movableContainer(this.ucExtends.PARENT.ucExtends.wrapperHT, this.lbl_title);
        this.makeResizable(this.ucExtends.PARENT.ucExtends.wrapperHT);

        parentExt.Events.captionChanged.on((newCaption) => {
            this.lbl_title.innerText = newCaption;
        })
    }
    movableContainer(container: HTMLElement, dragableObject: HTMLElement) {
        dragableObject.addEventListener('mousedown', mousedown_listner);

        function mousedown_listner(downEvt: MouseEvent) {
            downEvt.preventDefault(); // stop text selection

            const rect = container.getBoundingClientRect();

            // Mouse position relative to container
            const offsetX = downEvt.clientX - rect.left;
            const offsetY = downEvt.clientY - rect.top;

            function drag(moveEvt: MouseEvent) {
                const x = moveEvt.clientX - offsetX;
                const y = moveEvt.clientY - offsetY;

                container.style.position = "fixed"; // or absolute
                container.style.left = x + "px";
                container.style.top = y + "px";
            }

            window.addEventListener('mousemove', drag, false);

            function mouseup_mouseleave_event() {
                window.removeEventListener('mousemove', drag, false);
                window.removeEventListener('mouseup', mouseup_mouseleave_event);
                window.removeEventListener('mouseleave', mouseup_mouseleave_event);
            }

            window.addEventListener('mouseup', mouseup_mouseleave_event);
            window.addEventListener('mouseleave', mouseup_mouseleave_event);
        }
    }
    makeResizable(container: HTMLElement) {

        const MARGIN = 6;
        const MIN_W = 250;
        const MIN_H = 150;

        let mode: "" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" = "";

        let startX = 0, startY = 0;
        let startW = 0, startH = 0;
        let startL = 0, startT = 0;
        let activePointer = -1;

        container.addEventListener("pointermove", (e) => {
            if (activePointer !== -1) return;

            const r = container.getBoundingClientRect();
            const top = e.clientY - r.top <= MARGIN;
            const left = e.clientX - r.left <= MARGIN;
            const right = r.right - e.clientX <= MARGIN;
            const bottom = r.bottom - e.clientY <= MARGIN;

            if (top && left) mode = "nw";
            else if (top && right) mode = "ne";
            else if (bottom && left) mode = "sw";
            else if (bottom && right) mode = "se";
            else if (top) mode = "n";
            else if (bottom) mode = "s";
            else if (left) mode = "w";
            else if (right) mode = "e";
            else mode = "";

            container.style.cursor = mode ? mode + "-resize" : "default";
        });

        container.addEventListener("pointerdown", (e) => {
            if (!mode) return;

            activePointer = e.pointerId;
            container.setPointerCapture(activePointer);

            const r = container.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startW = r.width;
            startH = r.height;
            startL = r.left;
            startT = r.top;

            e.preventDefault();
        });

        container.addEventListener("pointermove", (e) => {
            if (e.pointerId !== activePointer) return;

            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            let newW = startW;
            let newH = startH;
            let newL = startL;
            let newT = startT;

            if (mode.includes("e")) newW = startW + dx;
            if (mode.includes("s")) newH = startH + dy;
            if (mode.includes("w")) { newW = startW - dx; newL = startL + dx; }
            if (mode.includes("n")) { newH = startH - dy; newT = startT + dy; }

            if (newW < MIN_W) {
                if (mode.includes("w")) newL -= (MIN_W - newW);
                newW = MIN_W;
            }

            if (newH < MIN_H) {
                if (mode.includes("n")) newT -= (MIN_H - newH);
                newH = MIN_H;
            }

            container.style.width = newW + "px";
            container.style.height = newH + "px";
            container.style.left = newL + "px";
            container.style.top = newT + "px";
        });

        container.addEventListener("pointerup", release);
        container.addEventListener("pointercancel", release);

        function release(e: PointerEvent) {
            if (e.pointerId !== activePointer) return;
            container.releasePointerCapture(activePointer);
            activePointer = -1;
            mode = "";
            container.style.cursor = "default";
        }
    }
}