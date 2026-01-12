import { contextBridge, ipcRenderer } from "electron";
import { IpcPreload } from "../main/ipc/IpcPreload.js";
IpcPreload.init(contextBridge, ipcRenderer); 