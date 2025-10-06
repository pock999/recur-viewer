import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { setupIpcHandlers } from "./electron-src/ipc/ipc-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  console.log("__filename => ", __filename);
  console.log("__dirname => ", __dirname);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 設置 preload 腳本的路徑
      preload: path.join(__dirname, "preload.js"),

      // 雖然您開啟了 nodeIntegration: true，但為了安全和程式碼隔離，
      // 建議使用 contextIsolation: true 配合 preload 腳本。
      // 為了與您現有程式碼兼容，我們先保留 nodeIntegration: true
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  // IPC process
  setupIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
