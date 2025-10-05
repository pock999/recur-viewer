import { ipcMain } from 'electron';
import BomDao from '../dao/bom-dao.js';

export function setupIpcHandlers() {
  console.log("setupIpcHandlers");
  ipcMain.handle('test-db-result-text', async(event, data) => {
    const res = await BomDao.getTestResultText();
    return res;
  })
}

