// ShortcutCore.ts

type ShortcutDef = {
  keys: string[];
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

  constructor(parent?: ShortcutContext) {
    this.parent = parent;
  }

  register(def: ShortcutDef) {
    this.node.register(def);
  }

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