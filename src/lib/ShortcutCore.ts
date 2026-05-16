// ShortcutCore.ts

import { Usercontrol } from "../core.js";
import { KeyboardKey } from "./ShortcutManager.js";

type ShortcutDef = {
  keys: KeyboardKey[];
  action: string;
  uc?: Usercontrol;
};

class ShortcutNode {
  map: Record<string, string> = {};

  register(def: ShortcutDef) {
    const key = this.normalize(def.keys);
    this.map[key] = def.action;
    if (def.uc != undefined) {
      def.uc.ucExtends.Events.beforeClose.on(async () => {
        if (this.map[key] === def.action) {

          console.log(def.action);
          console.log('deleted....');

          delete this.map[key];

        }
      });
    }
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
    /*setInterval(() => {
      console.log(this.node.map); 
    },2000);*/
  }
  uc: Usercontrol;
  registerBulk(defList: { [action: string]: KeyboardKey[] }, uc?: Usercontrol) {
    for (const [action, keys] of Object.entries(defList)) {
      this.register({ action: action, keys: keys, uc: uc });
    }
  }
  register(def: ShortcutDef, uc?: Usercontrol) {
    def.uc = def.uc ?? uc;
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