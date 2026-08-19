const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appApi', {
  loadState: () => ipcRenderer.invoke('state:load'),
  saveState: (nextState) => ipcRenderer.invoke('state:save', nextState),
  notify: (title, body) => ipcRenderer.invoke('notify', { title, body })
});
