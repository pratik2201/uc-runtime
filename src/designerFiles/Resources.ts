
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
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000": "",
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001": "uc-runtime\\styles.scss",
        "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002": "",
        
   }
}
const Resources:UserResource[] = [

    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"imports\":{},\"scopes\":{\"./\":{\"core.js\":\"./dist/core.js\",\"core-main.js\":\"./dist/core-main.js\",\"package.json\":\"./package.json\",\"designerFiles/Resources.js\":\"./dist/designerFiles/Resources.js\"}}}"  }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",   project: "uc-runtime",  source: "uc-runtime\\styles.scss",   type: "css",  encrypt:false,   content: ":exclude{html,body{font-family:Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-moz-user-select:none;font-size:small;object-fit:contain;height:100%;margin:0;position:fixed;left:0px;top:0px;bottom:0px;right:0px;}body *{font-size:inherit;outline:0;}.disabled,[disabled=\"true\"]{pointer-events:none;opacity:0.4;}}"  }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false,   content: "{\"cli\":{\"useElectron\":false,\"useTypeScript\":true,\"codeFileExt\":\".ts\",\"outputFileExt\":\".js\",\"designerDir\":\"designerFiles\",\"srcDir\":\"src\",\"outDir\":\"dist\",\"baseCssPath\":\"styles.scss\",\"devtools\":true,\"removeMenu\":true,\"ResourceStorageFile\":\"designerFiles/Resources.ts\"},\"guid\":\"f1441d07-173e-42ef-8ce0-df5f564c546e\",\"browser\":{\"resolveProjects\":[\"uc-dev\"],\"importmap\":{\"core.js\":\"dist/core.js\",\"core-main.js\":\"dist/core-main.js\",\"package.json\":\"package.json\",\"designerFiles/Resources.js\":\"dist/designerFiles/Resources.js\"}},\"preference\":{\"build\":{\"guidOptions\":{\"guidType\":\"sequenceAndSameGuid\",\"sequencePadSize\":8},\"ignorePath\":[\"node_modules\",\".git\",\".vscode\",\"dist\"],\"RuntimeResources\":[{\"includeExtensions\":[\".jpg\",\".png\",\".html\",\".scss\",\".ico\",\".svg\"],\"fromDeclare\":\"src\",\"toDeclares\":[\"out\"]}]},\"dirDeclaration\":{\"src\":{\"dirPath\":\"src\",\"fileDeclaration\":{\"code\":{\"extension\":\".ts\",\"subDirPath\":\"\"},\"designer\":{\"subDirPath\":\"designerFiles\",\"extension\":\".designer.ts\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}}},\"out\":{\"dirPath\":\"dist\",\"fileDeclaration\":{\"code\":{\"extension\":\".js\",\"subDirPath\":\"\"},\"designer\":{\"subDirPath\":\"designerFiles\",\"extension\":\".designer.js\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}}}},\"fileCommonDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"extension\":\".html\",\"subDirPath\":\"\"}},\"srcDec\":\"src\",\"outDec\":\"out\"},\"encryptResource\":false,\"projectBaseCssPath\":\"\"}"  }, 
];
ResourceStorage.bulkRegister(Resources);

ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000");

try { (await import("../main/ResourceManage.ipc.js")).default(); } catch(ex){ console.log(ex); } 

AssemblyManager.Register({
     name: "uc-runtime",
     ProjectGUID: "f1441d07-173e-42ef-8ce0-df5f564c546e",
     ProjectCSS: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",
     ProjectUcConfig: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002"
});


