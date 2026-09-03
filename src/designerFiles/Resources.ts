
import { UserResource, ResourceStorage,UpdateResourcePath, Assembly, AssemblyManager } from "../core-main.js";

import fs from "fs";
import path from "path";

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

    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false   }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",   project: "uc-runtime",  source: "uc-runtime\\styles.scss",   type: "css",  encrypt:false   }, 
    {   guid: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002",   project: "uc-runtime",  source: "",   type: "string",  encrypt:false   }, 
];
ResourceStorage.bulkRegister(Resources);

export async function loadAssembly(prePath: string = "") {

    AssemblyManager.Register(UpdateResourcePath({
         name: "uc-runtime",
         ProjectGUID: "f1441d07-173e-42ef-8ce0-df5f564c546e",
         ProjectCSS: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000001",
         ProjectUcConfig: "uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000002",
         ResourceStorageDir: "dist/main/files",
    }, prePath));

    ResourceStorage.RuntimeProps['importmap'] = ResourceStorage.RuntimeProps['importmap'] ?? ResourceStorage.getContent("uc-runtime:f1441d07-173e-42ef-8ce0-df5f564c546e:00000000");
    
    try { (await import("../main/ResourceManage.ipc.js")).default(); } catch(ex){ console.log(ex); } 
}
// console.log(fs.readFileSync(path.resolve('node_modules',"uc-runtime", 'package.json'), 'binary'));

