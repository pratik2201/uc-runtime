export enum DRAWABLE_SVG_ELEMENTS{
    "CIRCLE", "ELLIPSE" , "LINE" , "RECT" , "G", "PATH"
}
export enum VOID_SVG_ELEMENTS {
    "CIRCLE",
    "ELLIPSE",
    "LINE",
    "RECT",
    "USE",
    "IMAGE",
    "PATH",
    "STOP",
    "FEGAUSSIANBLUR",
    "FEOFFSET",
    "FEBLEND",
    "FECOLORMATRIX",
    "FECOMPONENTTRANSFER",
    "FECOMPOSITE",
    "FECONVOLVEMATRIX",
    "FEDIFFUSELIGHTING",
    "FEDISPLACEMENTMAP",
    "FEFLOOD",
    "FEFUNCA",
    "FEFUNCB",
    "FEFUNCG",
    "FEFUNCR",
    "FEMERGENODE",
    "FEMORPHOLOGY",
    "FESPECULARLIGHTING",
    "FETILE",
    "FETURBULENCE",
    "ANIMATE",
    "ANIMATETRANSFORM",
    "ANIMATEMOTION",
    "MPATH",
    "SET"
};
export enum NON_VOID_SVG_ELEMENTS {
    "SVG",
    "G",
    "DEFS",
    "SYMBOL",
    "MASK",
    "PATTERN",
    "MARKER",
    "TEXT",
    "TSPAN",
    "TEXTPATH",
    "A",
    "SWITCH",
    "CLIPPATH",
    "LINEARGRADIENT",
    "RADIALGRADIENT",
    "FILTER",
    "FOREIGNOBJECT",
    "DESC",
    "METADATA",
    "TITLE"
};
const VOID_SVG_ELEMENTS_LIST = [...Object.values(VOID_SVG_ELEMENTS), Object.values(NON_VOID_SVG_ELEMENTS)];
const ALL_SVG_ELEMENTS_LIST = [...Object.values(VOID_SVG_ELEMENTS), Object.values(NON_VOID_SVG_ELEMENTS)];

export interface PreDefinedPropertiesSVG<S = any> {
    id?: string;
    '<childs>'?: string[];
};
// RECT
export interface SvgRectProperties extends PreDefinedPropertiesSVG {
    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;
    rx?: number | string; // optional, rounded corners
    ry?: number | string; // optional, rounded corners
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    opacity?: number;
}

// CIRCLE
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

// ELLIPSE
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

// LINE
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

// TEXT
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
export type sCtypeBase = { [s in sas]: PreDefinedPropertiesSVG };
export interface sCtype extends sCtypeBase {
    'RECT': SvgRectProperties,
    'CIRCLE': SvgCircleProperties,
    'ELLIPSE': SvgEllipseProperties,
    'LINE': SvgLineProperties,
    'TEXT': SvgTextProperties,
}


export class SvgHelper<S = any> {
    constructor(importMeta: string) {
        this.importMeta = importMeta;
    }
    private importMeta = '';
    static Tag = <s extends keyof sCtype>([tagName, prefDefinedProps]: [s, sCtype[s]], ...childs: string[]) => {
        tagName = tagName.toUpperCase() as any;
        let htCode = `<${tagName} `;
        if (prefDefinedProps != undefined) {
            if (prefDefinedProps["<childs>"] != undefined) {
                childs = childs ?? [];
                childs.unshift(...prefDefinedProps["<childs>"]);
                delete prefDefinedProps['<childs>'];
            }

            for (let [key, value] of Object.entries(prefDefinedProps))
                htCode += ` ${key}="${value as any}"`;

        }

        if (VOID_SVG_ELEMENTS_LIST.includes(tagName)) {  //  if none closable element
            htCode += ' />';
            if (childs.length > 0) {
                console.error(`at WrapperHelper.Tag(); 
                               NONE CLOSABLE ELEMENT CANT HAVE CHILDREN.`);
            }
        } else {
            htCode += ` >`;
            childs?.forEach(s => htCode += s);
            htCode += `</${tagName}>`;
        }
        return htCode;
    };
} 