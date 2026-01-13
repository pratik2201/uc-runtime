import { codeFileInfo } from "../build/codeFileInfo.js";
import { nodeFn } from "../renderer/nodeFn.js";
import ucWinFrame$Dynamic from "../renderer/controls/ucWinFrame.uc.html.js";
import { Usercontrol } from "../renderer/Usercontrol.js";
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
export interface GlobalAttributes {
    'x-tabindex'?: number;
    'x-from'?: string;
    'x-name'?: any;
    'x-caption'?: string;
    '<childs>'?: string[];
    accesskey?: string;
    autocapitalize?: string;
    autofocus?: boolean;
    class?: string;
    contenteditable?: "true" | "false" | "inherit";
    dir?: "ltr" | "rtl" | "auto";
    draggable?: boolean;
    enterkeyhint?: string;
    hidden?: boolean;
    id?: string;
    inert?: boolean;
    inputmode?: string;
    is?: string;
    itemid?: string;
    itemprop?: string;
    itemref?: string;
    itemscope?: boolean;
    itemtype?: string;
    lang?: string;
    nonce?: string;
    part?: string;
    popover?: string;
    role?: string;
    slot?: string;
    spellcheck?: boolean;
    style?: string;
    tabindex?: number;
    title?: string;
    translate?: "yes" | "no";
}
export interface EventAttributes {
    // Clipboard
    oncopy?: string;
    oncut?: string;
    onpaste?: string;

    // Keyboard
    onkeydown?: string;
    onkeypress?: string;
    onkeyup?: string;

    // Mouse
    onclick?: string;
    ondblclick?: string;
    onmousedown?: string;
    onmousemove?: string;
    onmouseout?: string;
    onmouseover?: string;
    onmouseup?: string;
    onwheel?: string;

    // Drag
    ondrag?: string;
    ondragend?: string;
    ondragenter?: string;
    ondragleave?: string;
    ondragover?: string;
    ondragstart?: string;
    ondrop?: string;

    // Focus
    onfocus?: string;
    onblur?: string;
    onfocusin?: string;
    onfocusout?: string;

    // Form
    onchange?: string;
    oninput?: string;
    onreset?: string;
    onsubmit?: string;
    oninvalid?: string;

    // Media
    onplay?: string;
    onpause?: string;
    onended?: string;
    onvolumechange?: string;
    ontimeupdate?: string;
    onloadeddata?: string;
    onloadedmetadata?: string;

    // Window
    onload?: string;
    onunload?: string;
    onresize?: string;
    onscroll?: string;
    onerror?: string;
    oncontextmenu?: string;
}

export interface AnchorAttributes {
    href?: string;
    target?: string;
    download?: string | boolean;
    rel?: string;
    hreflang?: string;
    type?: string;
}

export interface ImageAttributes {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    loading?: "lazy" | "eager";
    decoding?: "sync" | "async" | "auto";
    referrerpolicy?: string;
    crossorigin?: "anonymous" | "use-credentials";
}

export interface InputAttributes {
    type?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    checked?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    pattern?: string;
    multiple?: boolean;
    accept?: string;
    autocomplete?: string;
    autofocus?: boolean;
    form?: string;
    list?: string;
}

export interface FormAttributes {
    action?: string;
    method?: "get" | "post" | "dialog";
    enctype?: string;
    target?: string;
    novalidate?: boolean;
    autocomplete?: string;
}

export interface ButtonAttributes {
    type?: "button" | "submit" | "reset";
    name?: string;
    value?: string;
    disabled?: boolean;
    form?: string;
}

export interface SelectAttributes {
    name?: string;
    multiple?: boolean;
    required?: boolean;
    disabled?: boolean;
    size?: number;
    form?: string;
}

export interface TextareaAttributes {
    name?: string;
    rows?: number;
    cols?: number;
    placeholder?: string;
    readonly?: boolean;
    disabled?: boolean;
    required?: boolean;
    maxlength?: number;
    minlength?: number;
    wrap?: "soft" | "hard";
    form?: string;
}

export interface ScriptAttributes {
    src?: string;
    type?: string;
    async?: boolean;
    defer?: boolean;
    crossorigin?: string;
    integrity?: string;
    referrerpolicy?: string;
}

export interface LinkAttributes {
    href?: string;
    rel?: string;
    media?: string;
    type?: string;
    sizes?: string;
    crossorigin?: string;
}

export interface MetaAttributes {
    name?: string;
    content?: string;
    charset?: string;
    "http-equiv"?: string;
}

export interface VideoAttributes {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    preload?: "none" | "metadata" | "auto";
    width?: number;
    height?: number;
    playsinline?: boolean;
}

export interface AudioAttributes {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: "none" | "metadata" | "auto";
}
export type HTMLBaseAttributes = GlobalAttributes & EventAttributes;

export interface HTMLTagMap {
    a: AnchorAttributes & HTMLBaseAttributes;
    img: ImageAttributes & HTMLBaseAttributes;
    input: InputAttributes & HTMLBaseAttributes;
    form: FormAttributes & HTMLBaseAttributes;
    button: ButtonAttributes & HTMLBaseAttributes;
    select: SelectAttributes & HTMLBaseAttributes;
    textarea: TextareaAttributes & HTMLBaseAttributes;
    script: ScriptAttributes & HTMLBaseAttributes;
    link: LinkAttributes & HTMLBaseAttributes;
    meta: MetaAttributes & HTMLBaseAttributes;
    video: VideoAttributes & HTMLBaseAttributes;
    audio: AudioAttributes & HTMLBaseAttributes;
}
export type AnyTagAttributes = HTMLBaseAttributes & {
    [key: string]: any;
};
export type HTMLTagMapper<S extends string> = Partial<S extends keyof HTMLTagMap ? HTMLTagMap[S] : AnyTagAttributes>;
export interface PreDefinedPropertiesHTML extends HTMLBaseAttributes {
    // 'tabindex'?: number;
    // 'x-tabindex'?: number;
    // 'x-from'?: string;
    // 'x-caption'?: string;
    // id?: string;
    // style?: string;


    // '<childs>': string[];
};
export interface IHTMLxSource {
    htmlSource: () => string;
    dynamicFilePath: string
}
export class HTMLx {
    static Design = (pera: IHTMLxSource) => {
        return pera;
    }
    static readonly htmlSource: () => string;
    /** out dynamic js file path */
    static readonly dynamicFilePath: string;
    static Tag = <S extends string>(tagName: S, prefDefinedProps?: HTMLTagMapper<S>, ...childs: string[]) => {
        tagName = tagName ?? 'div' as any;
        tagName = tagName.toUpperCase() as any;
        let htCode = `<${tagName} `;
        childs = childs ?? [];
        if (prefDefinedProps != undefined) {
            if (prefDefinedProps["<childs>"] != undefined) {
                //childs = childs ?? [];
                childs.unshift(...(prefDefinedProps["<childs>"] as string[]));
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
    static Wrapper = (wrapperProps: HTMLTagMapper<'WRAPPER'>, ...childs: string[]) => {
        return HTMLx.Tag('wrapper', wrapperProps, ...childs);
    };
    static Template = <S>(templates: { [id: string]: Partial<AnyTagAttributes> }) => {
        let cntnt: string[] = [];
        for (const [id, template] of Object.entries(templates)) {
            cntnt.push(this.Wrapper([Object.assign({ id: id }, template)]))
        }
        return HTMLx.Tag('x:template', {
            "<childs>": cntnt
        });
    }
    static Usercontrol = (name: string, targetUc: IHTMLxSource, outDynamicJsPath: string, ucProps: HTMLTagMapper<'WRAPPER'>, ...childs: string[]) => {
        let relpath: string;
        const targetCinfo = new codeFileInfo();
     //   debugger;
        targetCinfo.parseUrl(nodeFn.url.fileURLToPath(targetUc.dynamicFilePath), undefined, undefined);  // DESIGNER OUT
        const outDynamicCinfo = new codeFileInfo();
        outDynamicCinfo.parseUrl(nodeFn.url.fileURLToPath(outDynamicJsPath), undefined, undefined);  // DESIGNER OUT

        const pref = targetCinfo.projectInfo?.config?.preference;
        if (targetCinfo.pathOf != undefined) {
            relpath = nodeFn.path.relativeFilePath(outDynamicCinfo.pathOf.html, targetCinfo.pathOf.html);
            ucProps = ucProps ?? {};
            if (name != undefined)
                ucProps["x-name"] = name as any;
            ucProps["x-from"] = `{:${relpath}}`;
            return HTMLx.Tag(targetCinfo.name, ucProps, ...childs);
        }
        return undefined;
        //console.log(['Absolute', obj['AbsolutePath']]);
        // relpath = nodeFn.path.relativeFilePath(htmlFilePath, targetUc['AbsolutePath']);
        //console.log(relpath);


    };
}
export async function DynamicToHtml(fpath: string): Promise<IHTMLxSource> {
    try {
        return await (await import(fpath))?.default;
    } catch (e) {
        //console.warn('at WrapperHelper > DynamicToHtml \n ERROR IN :' + fpath);
        return undefined;
    }
}