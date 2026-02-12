import { UserResource, ResourceStorage, Assembly, AssemblyManager } from "../core-main.js";

declare module "ucbuilder/src/core-main" {
   export interface ResourceNamedRegistry{
      
   }

   export interface TPPackage {
        
            "ap-shared-core": "", 
   }

   
   export interface AssemblyRegistry{
        "ucbuilder" : Assembly
   }
   export interface ResourceKeyRegistry {
        "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000000": "",
        "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000001": "ucbuilder\\styles.scss",
        "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000002": "",
        
   }
}
const Resources:UserResource[] = [

    {   guid: "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000000",   project: "ucbuilder",  source: "",   type: "string",  encrypt:false,   content: "{\"imports\":{},\"scopes\":{\"./\":{\"ucbuilder/\":\"./\",\"ap-shared-core/\":\"../ap-shared-core/\"}}}"  }, 
    {   guid: "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000001",   project: "ucbuilder",  source: "ucbuilder\\styles.scss",   type: "css",  encrypt:false,   content: ":exclude{html,body{font-family:Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-moz-user-select:none;font-size:small;object-fit:contain;height:100%;margin:0;position:fixed;left:0px;top:0px;bottom:0px;right:0px}body *{font-size:inherit;outline:0}.disabled,[disabled=\"true\"]{pointer-events:none;opacity:0.4}}"  }, 
    {   guid: "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000002",   project: "ucbuilder",  source: "",   type: "string",  encrypt:false,   content: "{\"guid\":\"097DF085-D799-43EC-A783-CBFA4F228820\",\"browser\":{\"resolveProjects\":[\"ap-shared-core\"],\"importmap\":{\"ucbuilder\":\"\",\"ap-shared-core\":\"../ap-shared-core\"}},\"preference\":{\"build\":{\"guidOptions\":{\"guidType\":\"sequenceAndSameGuid\",\"sequencePadSize\":8},\"ignorePath\":[\"node_modules\",\".vscode\",\"out\",\"dist\",\".git\"],\"ResourceStorageFile\":\"designerFiles/Resources.ts\",\"RuntimeResources\":[]},\"dirDeclaration\":{\"src\":{\"dirPath\":\"src\",\"fileDeclaration\":{\"code\":{\"extension\":\".ts\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.ts\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.ts\",\"subDirPath\":\"\"},\"htmlLayout\":{\"extension\":\".htm\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"htmlFiles\",\"extension\":\".html\"}}},\"out\":{\"dirPath\":\"out\",\"fileDeclaration\":{\"code\":{\"extension\":\".js\",\"subDirPath\":\"\"},\"designer\":{\"extension\":\".designer.js\",\"subDirPath\":\"designerFiles\"},\"tsLayout\":{\"extension\":\".html.js\",\"subDirPath\":\"\"},\"scss\":{\"subDirPath\":\"\",\"extension\":\".scss\"},\"html\":{\"subDirPath\":\"htmlFiles\",\"extension\":\".html\"}}}},\"fileCommonDeclaration\":{\"designer\":{\"subDirPath\":\"designerFiles\"},\"scss\":{\"extension\":\".scss\",\"subDirPath\":\"\"},\"html\":{\"subDirPath\":\"htmlFiles\",\"extension\":\".html\"}},\"srcDec\":\"src\",\"outDec\":\"out\"},\"projectBaseCssPath\":\"styles.scss\",\"useTypeScript\":true,\"encryptResource\":false}"  }, 
];
ResourceStorage.bulkRegister(Resources);

ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000000");



AssemblyManager.Register({
     name: "ucbuilder",
     guid: "097DF085-D799-43EC-A783-CBFA4F228820",
     cssGuid: "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000001",
     ucConfigGuid: "ucbuilder:097DF085-D799-43EC-A783-CBFA4F228820:00000002"
});
