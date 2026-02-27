import { UserResource, ResourceStorage, Assembly, AssemblyManager } from "../core-main.js";

declare module "uc-runtime/src/core-main" {
   export interface ResourceNamedRegistry{
      
   }

   export interface TPPackage {
        
   }

   
   export interface AssemblyRegistry{
        "uc-runtime" : Assembly
   }
   export interface ResourceKeyRegistry {
        "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000000": "",
        "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000001": "uc-runtime\\styles.scss",
        "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000002": "",
        
   }
}
const Resources:UserResource[] = [

    {   guid: "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000000",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"imports\":{},\"scopes\":{}}"  }, 
    {   guid: "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000001",   project: "uc-runtime",  source: "uc-runtime\\styles.scss",   type: "css",  encrypt:false,   content: ":exclude{html,body{font-family:Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-moz-user-select:none;font-size:small;object-fit:contain;height:100%;margin:0;position:fixed;left:0px;top:0px;bottom:0px;right:0px;}body *{font-size:inherit;outline:0;}.disabled,[disabled=\"true\"]{pointer-events:none;opacity:0.4;}}"  }, 
    {   guid: "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000002",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"guid\":\"097DF085-D799-43EC-A783-CBFA4F228820\",\"browser\":{\"resolveProjects\":[\"ap-shared-core\"],\"importmap\":{},\"baseCssPath\":\"styles.scss\"},\"preference\":{\"build\":{\"guidOptions\":{\"guidType\":\"sequenceAndSameGuid\",\"sequencePadSize\":8},\"ignorePath\":[\"node_modules\",\".vscode\",\"out\",\"dist\",\".git\"],\"ResourceStorageFile\":\"designerFiles/Resources.ts\",\"RuntimeResources\":[{\"fromDeclare\":\"src\",\"toDeclares\":[\"out\"],\"includeExtensions\":[\".html\",\".scss\",\".mjs\",\".css\",\".svg\",\".png\",\".jpg\",\".ico\"]}]},\"dirDeclaration\":{\"src\":{\"dirPath\":\"src\",\"fileDeclaration\":{\"code\":{\"extension\":\".ts\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.ts\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.ts\",\"subDirPath\":\"\"},\"htmlLayout\":{\"extension\":\".htm\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}},\"out\":{\"dirPath\":\"out\",\"fileDeclaration\":{\"code\":{\"extension\":\".js\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.js\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.js\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"\",\"extension\":\".html\"}}}},\"fileCommonDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}},\"srcDec\":\"src\",\"outDec\":\"out\"},\"useTypeScript\":true,\"encryptResource\":false}"  }, 
];
ResourceStorage.bulkRegister(Resources);

ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000000");


AssemblyManager.Register({
     name: "uc-runtime",
     guid: "097DF085-D799-43EC-A783-CBFA4F228820",
     cssGuid: "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000001",
     ucConfigGuid: "uc-runtime:097DF085-D799-43EC-A783-CBFA4F228820:00000002"
});
