import { UserResource, ResourceStorage, Assembly, AssemblyManager } from "../core-main.js";

declare module "uc-control/src/core-main" {
   export interface ResourceNamedRegistry{
      
   }

   export interface TPPackage {
        
            "ap-shared-core": "", 
   }

   
   export interface AssemblyRegistry{
        "uc-control" : Assembly
   }
   export interface ResourceKeyRegistry {
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000000": "",
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000001": "uc-control\\styles.scss",
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000002": "",
        "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000003": "uc-control\\src\\controls\\ucWinFrame.uc.html",
        
   }
}
const Resources:UserResource[] = [

    {   guid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000000",   project: "uc-control",  source: "",   type: "string",  encrypt:false,   content: "{\"imports\":{},\"scopes\":{\"./\":{\"uc-control/\":\"./out/\",\"ap-shared-core/\":\"../ap-shared-core/\"}}}"  }, 
    {   guid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000001",   project: "uc-control",  source: "uc-control\\styles.scss",   type: "css",  encrypt:false,   content: ":exclude{html,body{font-family:Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-moz-user-select:none;font-size:small;object-fit:contain;height:100%;margin:0;position:fixed;left:0px;top:0px;bottom:0px;right:0px}body *{font-size:inherit;outline:0}.disabled,[disabled=\"true\"]{pointer-events:none;opacity:0.4}}"  }, 
    {   guid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000002",   project: "uc-control",  source: "",   type: "string",  encrypt:false,   content: "{\"guid\":\"097DF085-D799-43EC-A783-CBFA4F228820\",\"browser\":{\"resolveProjects\":[\"ap-shared-core\"],\"importmap\":{\"uc-control\":\"out\",\"ap-shared-core\":\"../ap-shared-core\"}},\"preference\":{\"build\":{\"guidOptions\":{\"guidType\":\"sequenceAndSameGuid\",\"sequencePadSize\":8},\"ignorePath\":[\"node_modules\",\".vscode\",\"out\",\"dist\",\".git\"],\"ResourceStorageFile\":\"designerFiles/Resources.ts\",\"RuntimeResources\":[{\"fromDeclare\":\"src\",\"toDeclares\":[\"out\"],\"includeExtensions\":[\".html\",\".scss\",\".mjs\",\".css\",\".svg\",\".png\",\".jpg\",\".ico\"]}]},\"dirDeclaration\":{\"src\":{\"dirPath\":\"src\",\"fileDeclaration\":{\"code\":{\"extension\":\".ts\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.ts\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.ts\",\"subDirPath\":\"\"},\"htmlLayout\":{\"extension\":\".htm\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}},\"out\":{\"dirPath\":\"out\",\"fileDeclaration\":{\"code\":{\"extension\":\".js\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.js\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.js\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}}},\"fileCommonDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}},\"srcDec\":\"src\",\"outDec\":\"out\"},\"projectBaseCssPath\":\"styles.scss\",\"useTypeScript\":true,\"encryptResource\":false}"  }, 
    {   guid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000003",   project: "uc-control",  source: "uc-control\\src\\controls\\ucWinFrame.uc.html",   type: "string",  encrypt:false,   content: "{\"htmlContents\":\"<WRAPPER x-caption=\\\"Frame\\\"><MAIN-CONTAINER><TITLE-BAR x-name=\\\"titlebar1\\\"><TITLE-TEXT x-name=\\\"lbl_title\\\">TITLE\\r\\n            </TITLE-TEXT><ICON-BUTTON x-name=\\\"cmd_close\\\">╳</ICON-BUTTON></TITLE-BAR>\\r\\n        <CONTAINER x-name=\\\"container1\\\"></CONTAINER>\\r\\n    </MAIN-CONTAINER></WRAPPER>\",\"cssContents\":\"$l-UC_WIN_TITLE_BACK:#124559;$l-UC_WIN_TITLE_FORE:#ffd60a;$l-UC_WIN_BORDER_FILL:#0c3a4c;&{position:relative;display:block;width:100%;height:100%;box-shadow:3px 3px 2px 0px #00000075}main-container{width:100%;height:100%;border:solid 1px black;display:grid;grid-template-rows:max-content auto}title-bar{width:inherit;display:grid;background-color:$l-UC_WIN_TITLE_BACK;grid-template-columns:auto max-content}title-text{padding:4px;display:block;width:100%}icon-button{display:block;width:30px;text-align:center;background-color:$l-UC_WIN_BORDER_FILL}title-text,icon-button{font-weight:bold;color:$l-UC_WIN_TITLE_FORE}icon-button:hover{background-color:$l-UC_WIN_TITLE_BACK}icon-close{display:block;background-color:$l-UC_WIN_BORDER_FILL}container{border-right:solid 4px $l-UC_WIN_BORDER_FILL;border-left:solid 4px $l-UC_WIN_BORDER_FILL;border-bottom:solid 4px $l-UC_WIN_BORDER_FILL}\"}"  }, 
];
ResourceStorage.bulkRegister(Resources);

ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000000");


AssemblyManager.Register({
     name: "uc-control",
     guid: "097DF085-D799-43EC-A783-CBFA4F228820",
     cssGuid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000001",
     ucConfigGuid: "uc-control:097DF085-D799-43EC-A783-CBFA4F228820:00000002"
});
