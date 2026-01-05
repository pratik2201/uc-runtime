import { nodeFn } from "../nodeFn.js";
import { Usercontrol } from "../Usercontrol.js";
const VOID_HTML_NODE_NAMES = [
    'AREA',
    'BASE',
    'BR',
    'COL',
    'EMBED',
    'HR',
    'IMG',
    'INPUT',
    'LINK',
    'META',
    'PARAM',
    'SOURCE',
    'TRACK',
    'WBR'
];
const VOID_SVG_ELEMENTS = [
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
];
const NON_VOID_SVG_ELEMENTS = [
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
];

export interface PreDefinedPropertiesHTML<S = any> {
    //name?: keyof S;
    'tabindex'?: number;
    //'x-name'?: keyof S;
    'x-tabindex'?: number;
    'x-from'?: string;
    id?: string;
    'x-caption'?: string;
    style?: string;

    '<childs>': string[];
};

export class HTMLx<S = any> {
    /*constructor(importMeta: string) {
        this.importMeta = importMeta;
    }
    private importMeta = '';*/
    static Tag = ([tagName, prefDefinedProps]: [string?, Partial<PreDefinedPropertiesHTML<any>>?], ...childs: string[]) => {
        tagName = tagName ?? 'div';
        tagName = tagName.toUpperCase();
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
        if (VOID_HTML_NODE_NAMES.includes(tagName)) {  //  if none closable element
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
    Wrapper = ([wrapperProps]: [Partial<PreDefinedPropertiesHTML<S>>?,Partial<PreDefinedPropertiesHTML<S>>?], ...childs: string[]) => {
        return HTMLx.Tag(['wrapper', wrapperProps]);
    };
    Template = (templates: { [id: string]: Partial<PreDefinedPropertiesHTML<S>> }) => {
        let cntnt: string[] = [];
        for (const [id, template] of Object.entries(templates)) {
            cntnt.push(this.Wrapper([Object.assign({ id: id }, template)]))
        }
        return HTMLx.Tag(['x:template', {}], ...cntnt);
    }
    static Usercontrol = ([name, obj, htmlFilePath, ucProps]: [string?, (typeof Usercontrol)?, string?, Partial<PreDefinedPropertiesHTML<any>>?], ...childs: string[]) => {
        let relpath: string;
        relpath = nodeFn.path.relativeFilePath(htmlFilePath, obj['AbsolutePath']);
        ucProps = ucProps ?? {};
        if (name != undefined)
            ucProps["x-name"] = name as any;

        ucProps["x-from"] = `{:${relpath}}`;
        return HTMLx.Tag([obj.name, ucProps], ...childs);
    };


} 