import { UserResource, ResourceStorage, Assembly, AssemblyManager } from "../core-main.js";

declare module "../core-main" {
   export interface ResourceNamedRegistry{
      
   }

   export interface TPPackage {
        
            "ap-shared-core": "", 
   }

   
   export interface AssemblyRegistry{
        "uc-runtime" : Assembly
   }
   export interface ResourceKeyRegistry {
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000": "",
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001": "uc-runtime\\styles.scss",
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002": "",
        
   }
}
const Resources:UserResource[] = [

    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"imports\":{},\"scopes\":{\"./\":{\"ap-shared-core/\":\"../ap-shared-core/\"}}}"  }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",   project: "uc-runtime",  source: "uc-runtime\\styles.scss",   type: "css",  encrypt:false,   content: ":exclude{html,body{font-family:Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-moz-user-select:none;font-size:small;object-fit:contain;height:100%;margin:0;position:fixed;left:0px;top:0px;bottom:0px;right:0px;}body *{font-size:inherit;outline:0;}.disabled,[disabled=\"true\"]{pointer-events:none;opacity:0.4;}}"  }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"guid\":\"f1441d07-173e-42ef-8ce0-df5f564c546e\",\"browser\":{\"resolveProjects\":[\"ap-shared-core\"],\"importmap\":{\"ap-shared-core\":\"../ap-shared-core\"},\"baseCssPath\":\"styles.scss\"},\"preference\":{\"build\":{\"guidOptions\":{\"guidType\":\"sequenceAndSameGuid\",\"sequencePadSize\":8},\"ignorePath\":[\"node_modules\",\".vscode\",\"out\",\"dist\",\".git\"],\"ResourceStorageFile\":\"designerFiles/Resources.ts\",\"RuntimeResources\":[{\"fromDeclare\":\"src\",\"toDeclares\":[\"out\"],\"includeExtensions\":[\".html\",\".scss\",\".mjs\",\".css\",\".svg\",\".png\",\".jpg\",\".ico\"]},{\"fromDeclare\":\"src\",\"toDeclares\":[\"dist\"],\"includeExtensions\":[\".html\",\".scss\",\".mjs\",\".css\",\".svg\",\".png\",\".jpg\",\".ico\"]}]},\"dirDeclaration\":{\"src\":{\"dirPath\":\"src\",\"fileDeclaration\":{\"code\":{\"extension\":\".ts\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.ts\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.ts\",\"subDirPath\":\"\"},\"htmlLayout\":{\"extension\":\".htm\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}},\"out\":{\"dirPath\":\"out\",\"fileDeclaration\":{\"code\":{\"extension\":\".js\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.js\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.js\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}},\"dist\":{\"dirPath\":\"dist\",\"fileDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\",\"extension\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}}},\"fileCommonDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}},\"srcDec\":\"src\",\"outDec\":\"out\"},\"useTypeScript\":true,\"encryptResource\":false}"  }, 
];
ResourceStorage.bulkRegister(Resources);

ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000");


AssemblyManager.Register({
     name: "uc-runtime",
     guid: "f1441d07-173e-42ef-8ce0-df5f564c546e",
     cssGuid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",
     ucConfigGuid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002"
});
