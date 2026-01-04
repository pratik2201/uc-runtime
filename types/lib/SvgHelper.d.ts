export declare enum DRAWABLE_SVG_ELEMENTS {
    "CIRCLE" = 0,
    "ELLIPSE" = 1,
    "LINE" = 2,
    "RECT" = 3,
    "G" = 4,
    "PATH" = 5
}
export declare enum VOID_SVG_ELEMENTS {
    "CIRCLE" = 0,
    "ELLIPSE" = 1,
    "LINE" = 2,
    "RECT" = 3,
    "USE" = 4,
    "IMAGE" = 5,
    "PATH" = 6,
    "STOP" = 7,
    "FEGAUSSIANBLUR" = 8,
    "FEOFFSET" = 9,
    "FEBLEND" = 10,
    "FECOLORMATRIX" = 11,
    "FECOMPONENTTRANSFER" = 12,
    "FECOMPOSITE" = 13,
    "FECONVOLVEMATRIX" = 14,
    "FEDIFFUSELIGHTING" = 15,
    "FEDISPLACEMENTMAP" = 16,
    "FEFLOOD" = 17,
    "FEFUNCA" = 18,
    "FEFUNCB" = 19,
    "FEFUNCG" = 20,
    "FEFUNCR" = 21,
    "FEMERGENODE" = 22,
    "FEMORPHOLOGY" = 23,
    "FESPECULARLIGHTING" = 24,
    "FETILE" = 25,
    "FETURBULENCE" = 26,
    "ANIMATE" = 27,
    "ANIMATETRANSFORM" = 28,
    "ANIMATEMOTION" = 29,
    "MPATH" = 30,
    "SET" = 31
}
export declare enum NON_VOID_SVG_ELEMENTS {
    "SVG" = 0,
    "G" = 1,
    "DEFS" = 2,
    "SYMBOL" = 3,
    "MASK" = 4,
    "PATTERN" = 5,
    "MARKER" = 6,
    "TEXT" = 7,
    "TSPAN" = 8,
    "TEXTPATH" = 9,
    "A" = 10,
    "SWITCH" = 11,
    "CLIPPATH" = 12,
    "LINEARGRADIENT" = 13,
    "RADIALGRADIENT" = 14,
    "FILTER" = 15,
    "FOREIGNOBJECT" = 16,
    "DESC" = 17,
    "METADATA" = 18,
    "TITLE" = 19
}
export interface PreDefinedPropertiesSVG<S = any> {
    id?: string;
    '<childs>'?: string[];
}
export interface SvgRectProperties extends PreDefinedPropertiesSVG {
    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;
    rx?: number | string;
    ry?: number | string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    opacity?: number;
}
export interface SvgCircleProperties extends PreDefinedPropertiesSVG {
    cx: number | string;
    cy: number | string;
    r: number | string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    opacity?: number;
}
export interface SvgEllipseProperties extends PreDefinedPropertiesSVG {
    cx: number | string;
    cy: number | string;
    rx: number | string;
    ry: number | string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    opacity?: number;
}
export interface SvgLineProperties extends PreDefinedPropertiesSVG {
    x1: number | string;
    y1: number | string;
    x2: number | string;
    y2: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    opacity?: number;
}
export interface SvgTextProperties extends PreDefinedPropertiesSVG {
    x: number | string;
    y: number | string;
    dx?: number | string;
    dy?: number | string;
    fontSize?: number | string;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: "normal" | "italic" | "oblique";
    textAnchor?: "start" | "middle" | "end";
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number | string;
    opacity?: number;
}
export type sas = keyof typeof NON_VOID_SVG_ELEMENTS;
export type sCtypeBase = {
    [s in sas]: PreDefinedPropertiesSVG;
};
export interface sCtype extends sCtypeBase {
    'RECT': SvgRectProperties;
    'CIRCLE': SvgCircleProperties;
    'ELLIPSE': SvgEllipseProperties;
    'LINE': SvgLineProperties;
    'TEXT': SvgTextProperties;
}
export declare class SvgHelper<S = any> {
    constructor(importMeta: string);
    private importMeta;
    static Tag: <s extends keyof sCtype>([tagName, prefDefinedProps]: [s, sCtype[s]], ...childs: string[]) => string;
}
