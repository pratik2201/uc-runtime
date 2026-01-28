// ResourceManage.d.ts

export interface ResourceKeyRegistry { }

export type ResourceKeyList = keyof ResourceKeyRegistry;


export interface ResourceAliasRegistry { }

export type ResourceAliasList = keyof ResourceAliasRegistry;

export * from './common/enumAndMore.js';