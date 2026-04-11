type ActionName =
  | "accept"
  | "cancel"
  | "openCompany"
  | "nextField"
  | "prevField";
  
type ShortcutDef = {
  keys: string[];        // ["Control", "A"]
  action: ActionName;
  mode?: string;         // optional mode restriction
};

export class ShortcutNode {
  private comboMap: Record<string, ShortcutDef> = {};
  private sequenceMap: Record<string, ShortcutDef> = {};

  register(def: ShortcutDef) {
    const key = ShortcutNode.normalize(def.keys);

    if (def.keys.length === 1 || def.keys.includes("Control") || def.keys.includes("Alt")) {
      this.comboMap[key] = def;
    } else {
      this.sequenceMap[key] = def;
    }
  }

  findCombo(combo: string, mode?: string): ActionName | null {
    const def = this.comboMap[combo];
    if (!def) return null;
    if (def.mode && def.mode !== mode) return null;
    return def.action;
  }

  findSequence(seq: string, mode?: string): ActionName | null {
    const def = this.sequenceMap[seq];
    if (!def) return null;
    if (def.mode && def.mode !== mode) return null;
    return def.action;
  }

  static normalize(keys: string[] | Set<string>): string {
    return [...keys].sort().join("+");
  }
}

export class ShortcutContext {
    node: ShortcutNode = new ShortcutNode();
    parent?: ShortcutContext;
    mode: string = "view";

    private handlers: Record<string, (e: KeyboardEvent) => void> = {};

    constructor(parent?: ShortcutContext) {
        this.parent = parent;
    }

    registerShortcut(def: ShortcutDef) {
        this.node.register(def);
    }

    on(action: ActionName, handler: (e: KeyboardEvent) => void) {
        this.handlers[action] = handler;
    }

    dispatch(action: ActionName, e: KeyboardEvent): boolean {
        if (this.handlers[action]) {
            this.handlers[action](e);
            return true;
        }
        if (this.parent) {
            return this.parent.dispatch(action, e);
        }
        return false;
    }

    resolveCombo(combo: string): ActionName | null {
        const action = this.node.findCombo(combo, this.mode);
        if (action) return action;
        return this.parent?.resolveCombo(combo) ?? null;
    }

    resolveSequence(seq: string): ActionName | null {
        const action = this.node.findSequence(seq, this.mode);
        if (action) return action;
        return this.parent?.resolveSequence(seq) ?? null;
    }
}

export class ShortcutManager {
    private pressedKeys = new Set<string>();
    private sequence: string[] = [];
    private sequenceTimer: any = null;

    currentContext!: ShortcutContext;

    constructor(root: ShortcutContext) {
        this.currentContext = root;

        window.addEventListener("keydown", this._keydown);
        window.addEventListener("keyup", this._keyup);
        window.addEventListener("blur", this._blur);
    }

    setContext(ctx: ShortcutContext) {
        this.currentContext = ctx;
    }

    private _keydown = (e: KeyboardEvent) => {
        if (this.pressedKeys.has(e.key)) return;

        this.pressedKeys.add(e.key);

        // ---- COMBO ----
        const combo = ShortcutNode.normalize(this.pressedKeys);
        const action = this.currentContext.resolveCombo(combo);

        if (action) {
            this.currentContext.dispatch(action, e);
            return;
        }

        // ---- SEQUENCE ----
        this.sequence.push(e.key);
        const seqStr = this.sequence.join("+");

        const seqAction = this.currentContext.resolveSequence(seqStr);

        if (seqAction) {
            this.currentContext.dispatch(seqAction, e);
            this.sequence = [];
            return;
        }

        this._resetSequenceTimer();
    };

    private _keyup = (e: KeyboardEvent) => {
        this.pressedKeys.delete(e.key);
    };

    private _blur = () => {
        this.pressedKeys.clear();
        this.sequence = [];
    };

    private _resetSequenceTimer() {
        clearTimeout(this.sequenceTimer);
        this.sequenceTimer = setTimeout(() => {
            this.sequence = [];
        }, 600);
    }
}