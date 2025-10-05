// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload');

contextBridge.exposeInMainWorld('api', {
  // 定義一個函式，它會呼叫 ipcRenderer.invoke
  getTestResultText: async (data) => ipcRenderer.invoke('test-db-result-text', data),
  getHierarchyList: async (data) => ipcRenderer.invoke('get-hierarchy-list', data),
  getInfoByKey: async (data) => ipcRenderer.invoke('get-base-info', data),
});