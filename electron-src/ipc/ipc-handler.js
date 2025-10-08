import { ipcMain } from "electron";
import HierarchyDao from "../dao/hierarchy-dao.js";
import InfoDao from "../dao/info-dao.js";

export function setupIpcHandlers() {
  ipcMain.handle("get-hierarchy-list", async (event, data) => {
    const res = await HierarchyDao.getHierarchyList(data);
    return res;
  });

  ipcMain.handle("get-base-info", async (event, data) => {
    const res = await InfoDao.getInfoByKey(data);
    return res;
  });
}
