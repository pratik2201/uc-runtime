# ucbuilder
:Shree Ganeshay Namah:<br />
**App Builder** – A modular UI framework for Electron-based applications.

---
# 🚀 BASIC INFO
this tool is used for manage sources and structers of electron project. 

what kind of project it work for ?

    - electron latest version is supperted (i tested in 39), 
    - package type =  es module
    

what it do in project ?
    
    - it generate designer files for you so you can easily access the control in ui.
    - all ui (usercontrol) will renderer in same browser window 
    - each loaded ui will have their seperated css
    - you can also import usercontrol from other projects.


how to apply this in project ?
  
    - there are 4 things to do.

---
  First one is `main.ts` (starting point of app).<br>
        
```ts
import { app, BrowserWindow, ipcMain, screen } from "electron";
import { IpcMainHelper } from "ucbuilder/out/ipc/IpcMainHelper.js"; // <-- import the library
let win: Electron.BrowserWindow;
app.on('ready', async () => {
    ...   
    await IpcMainHelper.init(ipcMain);  // <-- initlize main helper just before `BrowserWindow` created
    win = new BrowserWindow({
        ...
    });    
    // loading `index.html` file 
    // if you need `importmap` in browser. {
        IpcMainHelper.loadFile(join(__dirname, 'index.html'), win, '');  
    //} else { // use 
        win.loadFile(join(__dirname, 'index.html'));   
    //} 
```
---
Second one is `preload.ts` 
```ts
import { contextBridge, ipcRenderer } from "electron";
import { IpcPreload } from "ucbuilder/out/ipc/IpcPreload.js";
(async () => {
    await IpcPreload.init(contextBridge, ipcRenderer);  /* add these line of code (mandatory)    
    */
})();
```
---
Third one is `ucconfig.js` (renderer file)
```ts

```






# 🚀 Create Project
`Node Version 22.9.0` require (I Tested). ``you can test earliar or later version``

DOWNLOAD FILE `ucbuilderProjectGenerator.bat` FROM GIVEN Gdrive URL [here](https://drive.google.com/file/d/18rEZEAbY7zFthC_rQ_gwYNeAAvgZJPuQ/view?usp=drive_link)
. made for spoon-fed

move `ucbuilderProjectGenerator.bat` to the place where you want your new project and run (double click the file)

**give your answer for 2 given question** 

```bash
========================================
  Electron + ucbuilder Setup Tool
========================================

Enter your project name: 
Enter Electron version (e.g. 31.6.0,blank for latest):
```

now it should start initlize and install dependancies.
wait untill finish all installation.

open project in editor (**vscode** recommanded (`direct opened if exist`))

run the command 
```bash
npm run rebuild; npm start;
```
it will show basic dashboard in window..

**your project is ready to develope**

---
Quick Introduction Youtube : [here](https://www.youtube.com/watch?v=3ZUkDqP6DQU)
---
# 🚀 Instructions

this is **SINGLE WINDOW** App system.  

***BUILD DESIGNER*** <br>
---
designer build process done in render process (in browser)
default is ctrl+F12 in browser it will log 
`build start` and `build successfull..`
you can set keybinding in `ucconfig.json` file
 
***FILE TYPES*** <br>
---
ucconfig.json <br>
```json
{
    "$schema": "./node_modules/ucbuilder/config$schema.json",
    "browser":{
        "importmap": { 
            // path alices for (render process) for browser only 
        } 
    }, 
    "developer": {       
        "build": {
            "ignorePath": [],  // add path which will be ignore during designer build
            "buildPath": ".", // path to build
            "keyBind": 
            // key binding to start build process default is (ctrl+F12)
            { 
                "keyCode": 123, 
                "altKey": false,
                "ctrlKey": true,
                "shiftKey": false,            
            }
        }
    },
    "preference": {        
       "jsDir": "out", 
       //output dir where output file store
       
       "tsDir": "",
       // sourcecode dir
       
       "designerDir": "assets/designer", 
        //designer dir where designer file store
        //this path is sub directory of `jsDir` and `tsDir`
        // i.e tsDir = "src" , designerDir = "assets/designer"  finalpath will `src/assets/designer` 
    },
    "preloadMain": // this (.ipc.ts) files will load in main process before renderer load
    [ 
    ],
     "env": "developer", // this is under construction
     "type": "ts", // this is under construction   
}
```

***Usercontrol*** 
(single ui with multiple child `Usercontrols`)
--
*.uc.html `(html code)`<br>
*.uc.scss `(style code for perticular file)`<br>
*.uc.designer.ts `(auto-generated file include controls)`<br>
*.uc.ts `(typescript code file)`<br>

**inheritance**<br>
class `MainDashboard` -> class `MainDashboard$Designer` -> class `Usercontrol`<br>
(MainDashboard.uc.ts)&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;(MainDashboard.uc.designer.ts)

***Template*** (multiple ui repeator)
--
*.tpt.html `(html code)`
*.tpt.scss `(style code for perticular file)`
*.tpt.designer.ts `(auto-generated file include controls)`
*.tpt.ts `(typescript code file)`

**inheritance**<br>
class `itemRow` -> class `itemRow$Designer` -> class `Template`<br>
(itemRow.uc.ts)&nbsp; &nbsp;  &nbsp;&nbsp;(itemRow.uc.designer.ts)

***IPC handling*** (handle main and renderer bridge)
--
 
filename.ts `for renderer process`
```ts
import { IpcRendererHelper } from "ucbuilder/out/ipc/IpcRendererHelper.js";
const renderer = IpcRendererHelper.Group(import.meta.url);
function readJson(_path:string): company$model {
  return renderer.sendSync("readJson", [_path]);
}
```
filename.ipc.ts  `for main process`
```ts
import { IpcMainGroup } from "ucbuilder/out/ipc/IpcMainHelper.js";
import fs from "fs";
const main = IpcMainGroup(import.meta.url);
main.On("readJson", (e,_path) => {
    e.returnValue = fs.readFileSync(_path, 'binary');
});
```
***NOTE*** all `*.ipc.ts` files must be loaded before renderer process start execute.

(this process is done automatically on firsttime `import` the file)

you can define these paths manually by adding paths in `ucconfig.json` file  string property named `preloadMain`

all the file's described in `preloadMain` property will be loaded.

***OTHER MAIN FILES***
--

Program.ts `(starting point of renderer process (browser,web ui))`
```ts
import { MainDashboard } from "./src/MainDashboard.uc.js";

const frm = MainDashboard.Create({
  targetElement: document.body  // where you want load usercontrol
});
frm.ucExtends.show(); // this will load `MainDashboard` into targetElement
```
Program.styles.scss `(global style for current project)`

Program.main.ts `(starting point of node where electron setup done.)`

Program.preload-renderer.ts `(this file loaded just before Program.ts)`

Program.preload.cjs `(main process preload script. it should commonJs (.cjs))`

Program.viewer.html `(main page that loaded in window)`



