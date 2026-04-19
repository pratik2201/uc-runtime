// ShortcutCore.ts

import { KeyboardKey } from "./ShortcutManager.js";

type ShortcutDef = {
  keys: KeyboardKey[];
  action: string;
};

class ShortcutNode {
  private map: Record<string, string> = {};

  register(def: ShortcutDef) {
    const key = this.normalize(def.keys);
    this.map[key] = def.action;
  }

  find(combo: string) {
    return this.map[combo] ?? null;
  }

  private normalize(keys: string[] | Set<string>) {
    return [...keys].map(k => k.toLowerCase()).sort().join("+");
  }
}

export class ShortcutContext {
  node = new ShortcutNode();
  parent?: ShortcutContext;
  static globalRef? = new ShortcutContext();
  handlers: Record<string, (e: KeyboardEvent) => void> = {};
  static GetClone(of: ShortcutContext) {
    const rtrn = new ShortcutContext(of.parent);
    rtrn.node = of.node;
    rtrn.handlers = Object.assign({}, of.handlers);
    return rtrn;
  }
  constructor(parent?: ShortcutContext) {
    this.parent = parent;
  }
  registerBulk(defList: { [action: string]: KeyboardKey[] }) {
    for (const [action, keys] of Object.entries(defList)) {
      this.register({ action: action, keys: keys });
    }
  }
  register(def: ShortcutDef) {
    this.node.register(def);
  }
  // removeHandler(action:string) {
  //   delete this.handlers[action];
  // }
    
  on(action: string, handler: (e: KeyboardEvent) => void) {
    this.handlers[action] = handler;
  }

  resolve(combo: string): string | null {
    const act = this.node.find(combo);
    if (act) return act;
    return this.parent?.resolve(combo) ?? null;
  }

  dispatch(action: string, e: KeyboardEvent): boolean {
    if (this.handlers[action]) {
      this.handlers[action](e);
      return true;
    }
    return this.parent?.dispatch(action, e) ?? false;
  }
}