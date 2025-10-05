import { ipcMain } from 'electron';
import HierarchyDao from '../dao/hierarchy-dao.js';

export function setupIpcHandlers() {
  ipcMain.handle('test-db-result-text', async(event, data) => {
    const res = await HierarchyDao.getTestResultText();
    return res;
  })

  ipcMain.handle('get-hierarchy-list', async(event, data) => {
    const res = await HierarchyDao.getHierarchyList('materialA');
    return res;
  })
}

