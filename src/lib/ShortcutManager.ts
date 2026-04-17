// ================= TYPES =================

import { ShortcutContext } from "./ShortcutCore.js";

type GlobalActionNames =
    | "NEXT_FIELD_FOCUS"
    | "PREV_FIELD_FOCUS"
    | "LEFT_FIELD_FOCUS"
    | "RIGHT_FIELD_FOCUS";

type ActionNames = string;

type ModifierKey = "control" | "alt" | "shift" | "meta";

type LetterKey =
    | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
    | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t"
    | "u" | "v" | "w" | "x" | "y" | "z";

type NumberKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type FunctionKey =
    | "f1" | "f2" | "f3" | "f4" | "f5" | "f6"
    | "f7" | "f8" | "f9" | "f10" | "f11" | "f12";

type SpecialKey =
    | "enter"
    | "escape"
    | "tab"
    | "space"
    | "backspace"
    | "delete"
    | "arrowup"
    | "arrowdown"
    | "arrowleft"
    | "arrowright";

export type KeyboardKey =
    | ModifierKey
    | LetterKey
    | NumberKey
    | FunctionKey
    | SpecialKey;

// ================= NODE =================

export class ShortcutManager {
    static ref: ShortcutManager;

    private globalCtx: ShortcutContext;
    private formStack: ShortcutContext[] = [];
    private menuCtx?: ShortcutContext;

    constructor(globalCtx: ShortcutContext) {
        this.globalCtx = globalCtx;

        ShortcutManager.ref = this;

        window.addEventListener("keydown", this._keydown);
    }
    pushFormContext(ctx: ShortcutContext) {
        this.formStack.unshift(ctx);
    }

    popFormContext() {
        if (this.formStack.length > 0) {
            this.formStack.shift();
        }
    }
    // 🔹 current active form
    private getActiveContext() {
        return this.formStack[0];
    }
    get activeCtx(): ShortcutContext | undefined {
        return this.formStack[0];
    }
    // setActiveContext(ctx: ShortcutContext) {
    //     this.activeCtx = ctx;
    // }

    openMenu(ctx: ShortcutContext) {
        this.menuCtx = ctx;
    }

    closeMenu() {
        this.menuCtx = undefined;
    }

    private buildCombo(e: KeyboardEvent): string {
        const keys: string[] = [];

        if (e.ctrlKey) keys.push("control");
        if (e.altKey) keys.push("alt");
        if (e.shiftKey) keys.push("shift");

        const key = e.key.toLowerCase();

        if (!["control", "alt", "shift"].includes(key)) {
            keys.push(key);
        }

        return keys.sort().join("+");
    }

    private _keydown = (e: KeyboardEvent) => {
        const combo = this.buildCombo(e);

        // 1. MENU
        if (this.menuCtx) {
            const act = this.menuCtx.resolve(combo);
            if (act) {
                e.preventDefault();
                this.menuCtx.dispatch(act, e);
                return;
            }
        }

        // 2. ACTIVE FORM (TOP OF STACK)
        const active = this.getActiveContext();
        if (active) {
            const act = active.resolve(combo);
            if (act) {
                e.preventDefault();
                active.dispatch(act, e);
                return;
            }
        }

        // 3. GLOBAL
        const act = this.globalCtx.resolve(combo);
        if (act) {
            e.preventDefault();
            this.globalCtx.dispatch(act, e);
        }
    };
}

// export class ShortcutManager {
//     static ref: ShortcutManager;

//     private pressed = new Set<string>();
//     private contextStack: ShortcutContext[] = [];
//     // ADD THIS

//     private contexts: ShortcutContext[] = [];

//     setContexts(contexts: ShortcutContext[]) {
//         this.contexts = contexts;
//     }
//     current!: ShortcutContext;

//     constructor(root: ShortcutContext) {
//         this.contextStack = [root];
//         this.current = root;

//         ShortcutManager.ref = this;

//         window.addEventListener("keydown", this._keydown);
//         window.addEventListener("keyup", this._keyup);
//         window.addEventListener("blur", this._blur);
//     }

//     push(ctx: ShortcutContext) {
//         this.contextStack.unshift(ctx);
//         this.current = ctx;
//     }

//     pop() {
//         if (this.contextStack.length > 1) {
//             this.contextStack.shift();
//             this.current = this.contextStack[0];
//         }
//     }

//     buildCombo = (evt: KeyboardEvent): string => {
//         const keys: string[] = [];

//         if (evt.ctrlKey) keys.push("control");
//         if (evt.altKey) keys.push("alt");
//         if (evt.shiftKey) keys.push("shift");

//         const key = evt.key.toLowerCase();
//         if (!["control", "shift", "alt"].includes(key)) {
//             keys.push(key);
//         }

//         return keys.sort().join("+");
//     }

//     private _keydown = async (e: KeyboardEvent) => {
//         const key = e.key?.toLowerCase();
//         if (!key || key === "unidentified") return;

//         const combo = this.buildCombo(e);

//         // 🔥 PRIORITY LOOP
//         for (const ctx of this.contexts) {
//             const action = ctx.resolveCombo(combo);

//             if (action) {
//                 e.preventDefault();
//                 const handled = await ctx.dispatch(action, e);
//                 if (handled) return;
//             }
//         }

//         // (optional sequence logic here)
//     };

//     private _keyup = (evt: KeyboardEvent) => {
//         this.pressed.delete(evt.key.toLowerCase());
//     };

//     private _blur = () => {
//         this.pressed.clear();
//     };
// }