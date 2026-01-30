import { app, BrowserWindow, ipcMain, screen } from "electron";
import { dirname, join } from "path";
import { IpcMainHelper } from "./ipc/IpcMainHelper.js";
import { fileURLToPath, pathToFileURL } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let win: Electron.BrowserWindow;
app.on('ready', async () => {
     debugger;
    await IpcMainHelper.init(import.meta.url,undefined);
    let mainScreen: Electron.Display = screen.getPrimaryDisplay();
    win = new BrowserWindow({
        width: mainScreen.size.width,
        height: mainScreen.size.height,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            spellcheck: false,
            webSecurity: true,
            preload: join(__dirname, '../preload/index.js'),
        },
    });
    win.setMenu(null);
    try {
        IpcMainHelper.loadURL(pathToFileURL(join(__dirname, '../../index.html')).href, win, { baseURLForDataURL: join(__dirname, '../../') });
        win.webContents.once('did-finish-load', () => {
            console.log('Renderer loaded');
            //if (!app.isPackaged) {
                win!.webContents.openDevTools(/*{ mode: 'detach' }*/);
            //}
        });
        win.on('closed', () => {
            win = null;
        });
    } catch (ex) {
        console.log(ex);
    }
});