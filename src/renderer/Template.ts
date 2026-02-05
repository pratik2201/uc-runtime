import { ExtractArguments, ISourceOptions, ITemplatePathOptions, ITptOptions, TptOptions } from "../common/enumAndMore.js";
import { TemplateMaker } from "ap-shared-core/out/template/TemplateMaker.js";
import { ResourceKeyList, ResourceKeyRegistry } from "ap-shared-core/out/ucbuilder/resources/enums.js";
import { ATTR_OF, ucUtil } from "ap-shared-core/out/ucbuilder/ucUtil.js";
import { FilterContent, SourceNode, STYLER_SELECTOR_TYPE } from "../lib/StampGenerator.js";
import { Assembly, AssemblyManager } from "../main/Assembly.js";
import { ResourceManage } from "./ResourceManage.js";
import { CSSSearchAttributeCondition, CssVariableHandler, CSSVariableScope, StyleBaseType, StylerRegs, VariableList } from "./StylerRegs.js";
import { ITransferDataNode, Usercontrol } from "./Usercontrol.js";


export class Template {
  static MATERIAL: ISourceOptions = {
    htmlGuid: undefined as keyof ResourceKeyRegistry,
    cssGuid: undefined as keyof ResourceKeyRegistry,
  }
  static extractArgs = (args: any) => ExtractArguments(args);

  static splitCSSById(cssContent: string/*, cssFilePath: string, importMetaUrl: string*/, rtrn: { [key: string]: ITemplatePathOptions }): string {
    let rtrnKeys = Object.keys(rtrn);
    //  if (cssContent.includes('part2Size')) debugger;
    //cssContent = StylerRegs.REMOVE_EXTRASPACE(StylerRegs.REMOVE_COMMENT(useLoader(cssContent, cssFilePath, importMetaUrl)));
    cssContent = cssContent;//dev$Use_loader(cssContent, cssFilePath);
    let cssExtrct = StylerRegs.ScssExtractor(cssContent);

    let outerRulesCSS = "";
    let commonRulesCSS = "";
    //console.log(cssContent);
    let gkeys = [] as string[];
    let hasAnyId = false;
    let prevCnt = '';
    for (let i = 0, iObj = cssExtrct, ilen = iObj.length; i < ilen; i++) {
      const iItem = iObj[i];
      let hasFound = false;
      /*outerRulesCSS += */iItem.frontContent.replace(/([\s\S]*)\#(\w+)\s*$/mg, (m, prevCn: string, ids: string) => {
        let robj = rtrn[ids];
        if (robj != undefined) { // IF TEMPLATENODE FOUND
          robj.cssContents = robj.cssContents == undefined ? iItem.betweenContent : robj.cssContents + ` ` + iItem.betweenContent;
          hasFound = true;
          hasAnyId = true;
          gkeys.push(ids);
          outerRulesCSS += ' ' + prevCn.trim();
          return '';//' ' + prevCn.trim() + ' ';
        } else {        // IF NOT FOUND
          if (iItem.child.length == 0) { return m; }
          else { hasFound = true; return ''; }
        }
      });
      if (!hasFound) {
        //console.log(iItem.frontContent);
        let fcSplitted = iItem.frontContent.split(';');
        let selector = fcSplitted.pop();
        let fcontent = fcSplitted.join(';');
        if (fcSplitted.length > 0) fcontent += ';';
        //console.log(iItem.frontContent);        
        if (!selector.includes('&')) {
          outerRulesCSS += iItem.frontContent + ' { ' + iItem.betweenContent + ' } ';
        } else {
          outerRulesCSS += fcontent; //console.log([fcontent,selector]);
          commonRulesCSS += selector + ' { ' + iItem.betweenContent + ' } ';
        }
      }
    }//else
    if (!hasAnyId) {
      if (rtrn["primary"] != undefined) {
        let p = rtrn["primary"];
        p.cssContents = p.cssContents == undefined ? cssContent : p.cssContents + `
          ` + cssContent;
      }
      return outerRulesCSS;
    }
    if (commonRulesCSS.length > 0)
      for (let i = 0, iObj = rtrnKeys, ilen = iObj.length; i < ilen; i++) {
        const iItem = iObj[i];
        let ck = rtrn[iItem].cssContents ?? '';
        rtrn[iItem].cssContents = commonRulesCSS + ck;
      }

    return outerRulesCSS;
    /*function useLoader(csscnt: string, cssFpath: string, importMetaUrl: string): string {
      //console.log(cssContent);
      let ppath: string = undefined;
      if (cssFpath != undefined)
        ppath = nodeFn.path.dirname(cssFpath);
      csscnt = csscnt.replace(/\@use\s*([\"'`])((?:\\.|(?!\1)[^\\])*)\1\s*;/gim,
        (match: string, quationMark: string, path: string) => {
          let pth = ucUtil.devEsc(path);
          if (ppath != undefined)
            pth = nodeFn.path.resolve(ppath, pth);
          let c = nodeFn.fs.readFileSync(pth, 'binary')
          let prj = GetDeclaration(pth);// ProjectManage.getInfo(pth, importMetaUrl).project;

          return useLoader(c, pth, prj.project.importMetaURL);
        });
      return csscnt;
    }*/
  }
  static GetOptionsByContent(htmlcontent: string, cssContent: string/*, cssFilePath: string, importMetaUrl: string*/): {
    outerCSS: string,
    tptObj: { [key: string]: ITemplatePathOptions }
  } {
    let ele = ucUtil.PHP_REMOVE(htmlcontent)["#$"]();
    let rtrn: { [key: string]: ITemplatePathOptions } = {};
    let hasMultipleNode = !ele.hasAttribute('id');
    if (hasMultipleNode) {
      for (let i = 0, iObj = Array.from(ele.children), ilen = iObj.length; i < ilen; i++) {
        const ichild = iObj[i];
        let id = ichild.getAttribute('id');
        if (id != null) {
          rtrn[id] = {
            accessKey: id,
            objectKey: undefined,
            htmlContents: ucUtil.PHP_ADD(ichild.outerHTML),
          };
        }
      }
    } else {
      let id = ele.getAttribute('id');
      rtrn[id] = {
        accessKey: id,
        objectKey: undefined,
        htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
      };
    }
    let rtrnKeys = Object.keys(rtrn);
    let isSimpleMode = false;
    if (rtrnKeys.length == 0) {
      rtrn["primary"] = {
        accessKey: "primary",
        objectKey: undefined,
        htmlContents: ucUtil.PHP_ADD(ele.outerHTML),
      };
      rtrnKeys = ["primary"];
      isSimpleMode = true;
    }
    let outerCSS = this.splitCSSById(cssContent, /*cssFilePath, importMetaUrl,*/ rtrn);
    return { outerCSS: outerCSS, tptObj: rtrn };
  }

  /**
   * !!!! THIS METHOD USED IN DESIGNER FILES
   * @param cinfo 
   * @param htContent 
   * @param cssdata 
   * @returns 
   */
  static GetObjectOfTemplate(/*cinfo: codeFileInfo,*/cssGuid: string, htmlResKey: keyof ResourceKeyRegistry, cssResKey: keyof ResourceKeyRegistry) {
    return this._GetObjectOfTemplate(/*cinfo,*/cssGuid, ResourceManage.getContent(htmlResKey), ResourceManage.getContent(cssResKey))
  }
  private static _GetObjectOfTemplate(/*cinfo: codeFileInfo,*/cssGuid: string, htContent: string, cssdata: string): { outerCSS: string, tptObj: { [key: string]: ITemplatePathOptions } } {

    //let impUrl = cinfo.projectInfo.importMetaURL;
    //htContent = htContent ?? nodeFn.fs.readFileSync(cinfo.pathOf.html);

    // if (cssdata == undefined) {
    //   if (nodeFn.fs.existsSync(cinfo.pathOf.scss))
    //     cssdata = nodeFn.fs.readFileSync(cinfo.pathOf.scss);
    // }


    let robj = this.GetOptionsByContent(htContent, cssdata);
    let _cssGuid = cssGuid//cinfo.fullWithoutExt('html');
    for (let i = 0, iObj = Object.values(robj.tptObj), ilen = iObj.length; i < ilen; i++) {
      const irow = iObj[i];
      irow.objectKey = _cssGuid + "#" + irow.accessKey;
    }
    return robj;
  }

  static GetArrayOfTemplate(/*cinfo: codeFileInfo,*/cssGuid: string, htContent: string, cssdata: string): ITemplatePathOptions[] {
    let ar = [] as ITemplatePathOptions[];
    let objs = Template._GetObjectOfTemplate(cssGuid, htContent, cssdata).tptObj;
    for (let i = 0, iObj = Object.keys(objs), ilen = iObj.length; i < ilen; i++)
      ar.push(objs[iObj[i]]);
    return ar;

  }
  createTemplate(tptPathOpt: ITemplatePathOptions): TemplateNode {
    let tnode = new TemplateNode(this);
    let tExt = this.extended;

    let cfg = Object.assign({}, TptOptions);
    //cfg.cfInfo = tExt.cfInfo;

    cfg.parentUc = tExt.parentUc;
    tnode.extended.initializecomponent(cfg, tptPathOpt);
    return tnode;
  }
  pushTemplateCss(cssCode: string, cssGuid: ResourceKeyList, baseType?: StyleBaseType, mode: CSSSearchAttributeCondition = '*') {
    let accessName = `@`;
    let ext = this.extended;
    //console.log(cssGuid);

    let snode = SourceNode.registerSource({
      key: cssGuid + "@",
      accessName: accessName,
      baseType: baseType,
      assembly: AssemblyManager.Parse(cssGuid),
      //project: ext.cfInfo.projectInfo,
      mode: mode,
      generateStamp: false
    });
    //snode.styler.selectorHandler.selectorMode = mode;
    let puc = ext.parentUc;
    let pext = puc.ucExtends;
    snode.config({
      parentUc: puc,
      parentSrc: pext.srcNode,
      wrapper: pext.wrapperHT,
      key: `${cssGuid /*ext.cfInfo.fullWithoutExt('html')*/}${accessName}`,
      accessName: accessName
    });
    snode.pushCSSByContent(cssGuid /*ext.cfInfo.pathOf.scss*/, cssCode, /*ext.cfInfo.actualdProject,*/ pext.wrapperHT);
    pext.Events.afterClose.on(({ }) => {
      snode.release();
    });
  }


  extended = {
    initializebase: (pera: ITptOptions) => {
      StylerRegs.templateID++;
      const _ext = this.extended;
      _ext.parentUc = pera.parentUc;
      // _ext.cfInfo = pera.cfInfo;
      _ext.assembly = AssemblyManager.Parse(pera.source.htmlGuid);
    },

    assembly: undefined as Assembly,
    ///cfInfo: undefined as codeFileInfo,
    parentUc: undefined as Usercontrol,
  };
}
export class TemplateNode {
  // static COUNTER = 0;
  //nodeCounter = TemplateNode.COUNTER;
  constructor(main: Template) {
    //TemplateNode.COUNTER++;
    this.extended.main = main;
    //Template._CSS_VAR_STAMP++;
    //this.extended.cssVarStampKey = "t" + Template._CSS_VAR_STAMP;
  }
  //static virtualDoc = document.implementation.createHTMLDocument("Virtual");
  //static _CSS_VAR_STAMP = 0;
  extended = {
    // fileStamp: "",
    // cssVarStampKey: "0",
    main: undefined as Template,
    srcNode: undefined as SourceNode,
    accessName: undefined as string,
    parentUc: undefined as Usercontrol,
    // wrapper: undefined as HTMLElement,
    //  size: new Size(),
    //regsMng: new regsManage(),
    setCssVariable: (varList: VariableList, scope: CSSVariableScope) => {
      let styler = this.extended.srcNode.styler;
      switch (scope) {
        case 'global': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.ROOT, "g"); break;
        case 'template': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.TEMPLATE, "t", this.extended.parentUc.ucExtends.self); break;
        case 'local': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.LOCAL, "l", this.extended.parentUc.ucExtends.self); break;
        case 'internal': CssVariableHandler.SetCSSVarValue(varList, styler.KEYS.INTERNAL, "i", this.extended.parentUc.ucExtends.self); break; // StylerRegs.internalKey
      }
    },
    getCssVariable: (key: string, scope: CSSVariableScope): string => {
      let styler = this.extended.srcNode.styler;
      switch (scope) {
        case 'global': return document.body.style.getPropertyValue(
          CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.ROOT, "g"));
        case 'template': return this.extended.parentUc.ucExtends.self.style.getPropertyValue(
          CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.TEMPLATE, "t"));
        case 'local': return this.extended.parentUc.ucExtends.self.style.getPropertyValue(
          CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.LOCAL, "l"));
        case 'internal': return this.extended.parentUc.ucExtends.self.style.getPropertyValue(
          CssVariableHandler.GetCombinedCSSVarName(key, styler.KEYS.INTERNAL, "i")); // StylerRegs.internalKey
        default: return '';
      }
    },
    generateContent: (jsonRow: {}, preDefinedContent?: string): string => {
      let _this = this.extended;
      let dta = preDefinedContent ?? _this.srcNode.htmlCode.content;
      dta = _this.Events.beforeGenerateContent(dta, jsonRow);
      //dta = _this.regsMng.parse(jsonRow, dta);
      dta = _this.tmaker.compileTemplate(dta)(jsonRow);
      dta = _this.Events.onGenerateContent(dta, jsonRow);
      return dta;
    },
    tmaker: new TemplateMaker(/*import.meta.url*/),
    generateNode: (jsonRow: any): HTMLElement => {
      let _ext = this.extended;
      let dta = _ext.generateContent(jsonRow) as string;

      let element = dta["#$"]();

      // TemplateNode.virtualDoc.body.append(element);
      //console.log(_this.stampRow);

      let ctrls = _ext.srcNode.passElement(element, { skipTopEle: false, groupKey: _ext.srcNode.styler.KEYS.TEMPLATE });
      _ext.Events.onGenerateNode(element, jsonRow, ctrls);
      return element;
    },

    initializecomponent: (
      _args: ITptOptions,
      tptPathOpt: ITemplatePathOptions
    ) => {
      let tptExt = this.extended;
      let param0 = Object.assign(Object.assign({}, TptOptions), _args);
      tptExt.accessName = tptPathOpt.accessKey;
      tptExt.srcNode = SourceNode.registerSource(
        {
          key: tptPathOpt.objectKey,
          accessName: tptExt.accessName,
          baseType: StyleBaseType.Template,
          assembly: tptExt.main.extended.assembly,
          mode: '^',
          //project: param0.cfInfo.projectInfo,
          generateStamp: false
        });
      let isAlreadyExist = tptExt.srcNode.htmlCode.load(tptPathOpt.htmlContents);
      if (!isAlreadyExist)
        tptExt.srcNode.loadHTML(false);

      let htEle = tptExt.srcNode.dataHT;

      Array.from(tptExt.srcNode.dataHT.attributes)
        .filter((s) => s.nodeName.toLowerCase().startsWith("x.temp-"))
        .forEach((s) => htEle.removeAttribute(s.nodeName));

      tptExt.parentUc = tptExt.main.extended.parentUc;

      let puc = tptExt.parentUc;
      let pext = puc.ucExtends;

      tptExt.srcNode.config({
        parentUc: puc,
        parentSrc: pext.srcNode,
        wrapper: pext.wrapperHT,
        key: `${param0.source.cssGuid}@${tptPathOpt.accessKey}`,
        accessName: tptPathOpt.accessKey
      });


      tptExt.srcNode.pushCSSByContent(param0.source.cssGuid/*undefined*/, tptPathOpt.cssContents, tptExt.parentUc.ucExtends.self);
      tptExt.parentUc.ucExtends.Events.afterClose.on(({ }) => {
        tptExt.srcNode.release();
      });

      tptExt.Events.onDataExport = (data) =>
        param0.parentUc.ucExtends.Events.onDataExport(data);
    },
    sampleNode: undefined as HTMLElement,
    Events: {
      //onGettingContent: (jsonRow: any) => { return this.extended.stampRow.content; },
      beforeGenerateContent: (content: string, jsonRow: any) => content,
      onGenerateContent: (content: string, jsonRow: any) => content,
      onGenerateNode: (mainNode: HTMLElement, jsonRow: any, ctrls?: { [key: string]: HTMLElement | HTMLElement[] }) => { },

      onDataExport: (data: ITransferDataNode) => {
        return false;
      },

      onDataImport: (data: ITransferDataNode) => {
        return false;
      },
    },
    destruct: () => {
      let _this = this;
      let _ext = _this.extended;
      _ext.srcNode.release();
    },
    find: (skey: string, fromHT: HTMLElement) => {
      let exp = /(["=> \w\[\]-^|#~$*.+]*)(::|:)([-\w\(\)]+)/g;
      let ar = skey.split(",");
      let ext = this.extended;
      let q = "";
      let uniqStamp = ext.srcNode.localStamp;
      ar = ar.map((s) => {
        s = FilterContent.select_inline_filter(s, uniqStamp);
        return s;
      });
      return Array.from(fromHT.querySelectorAll(ar.join(",")));
    },
    getAllControls: (specific: string[], fromHT: HTMLElement) => {
      if (fromHT == undefined) return;
      let childs: { [key: string]: HTMLElement } = {};
      let uExt = this;
      let fromElement = fromHT;
      if (specific != undefined) {
        let uniqStamp = uExt.extended.srcNode.localStamp;
        specific.forEach((itmpath) => {
          if (!(itmpath in childs)) {
            let ele: HTMLElement;
            if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
              ele = fromElement.querySelector(
                `[${ATTR_OF.X_NAME}='${itmpath}'][${ATTR_OF.UC.ALL}^='${uniqStamp}_']`  // old one  `[${propOpt.ATTR.ACCESS_KEY}='${itmpath}'][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
              ) as HTMLElement;
            } else {
              ele = fromElement.querySelector(
                `[${ATTR_OF.X_NAME}='${itmpath}'].${ATTR_OF.__CLASS(uniqStamp, 'l')}`  // old one  `[${propOpt.ATTR.ACCESS_KEY}='${itmpath}'][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
              ) as HTMLElement;
            }
            fillObj(itmpath, ele);
          }
        });
      } else {
        let uniqStamp = uExt.extended.srcNode.localStamp;
        let eleAr: HTMLElement[] = [];
        if (SourceNode.MODE == STYLER_SELECTOR_TYPE.ATTRIB_SELECTOR) {
          eleAr = Array.from(
            fromElement.querySelectorAll(
              `[${ATTR_OF.X_NAME}][${ATTR_OF.UC.ALL}^='${uniqStamp}_']`  // old one  `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
            )
          ) as HTMLElement[];
        } else {
          eleAr = Array.from(
            fromElement.querySelectorAll(
              `.${ATTR_OF.__CLASS(uniqStamp, 'l')}[${ATTR_OF.X_NAME}]`  // old one  `[${propOpt.ATTR.ACCESS_KEY}][${ATTR_OF.UC.UNIQUE_STAMP}='${uniqStamp}']`
            )
          ) as HTMLElement[];
        }
        eleAr.forEach((ele) => {
          fillObj(ele.getAttribute(ATTR_OF.X_NAME), ele);
        });
      }
      function fillObj(itmpath: string, htEle: HTMLElement) {
        if (htEle != undefined) childs[itmpath] = htEle;
        else console.warn("empty-controls-returned");
      }
      return childs;
    },
  };
}