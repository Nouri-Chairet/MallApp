const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');

const store = new Store({
  name: 'self-improvement-state',
  defaults: {
    entries: {},
    reminderLog: {},
    celebratedMilestones: []
  }
});

const autoLauncher = new AutoLaunch({
  name: 'Self Improvement Coach'
});

const ensureAutoLaunch = async () => {
  try {
    const enabled = await autoLauncher.isEnabled();
    if (!enabled) {
      await autoLauncher.enable();
    }
  } catch (error) {
    console.error('Auto-launch setup failed:', error);
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 1000,
    minHeight: 700,
    title: 'Self Improvement Coach',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
};

ipcMain.handle('state:load', () => store.store);
ipcMain.handle('state:save', (_, nextState) => {
  store.set(nextState);
  return store.store;
});
ipcMain.handle('notify', (_, payload) => {
  if (!Notification.isSupported()) {
    return false;
  }

  const { title, body } = payload;
  const notification = new Notification({
    title,
    body,
    urgency: 'normal'
  });
  notification.show();
  return true;
});

app.whenReady().then(async () => {
  await ensureAutoLaunch();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
