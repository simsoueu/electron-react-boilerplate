/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { parseCSVFile } from './csv-parser';

let projectData: any = null;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('project:initialize', async (_event, data) => {
  console.log('Initializing project:', data);
  projectData = {
    id: uuidv4(),
    numeroProcesso: data.numeroProcesso || '138/2025',
    uasg: data.uasg || '123456',
    responsavel: data.responsavel || 'João Silva',
    dataPesquisa: data.dataPesquisa || new Date().toISOString(),
    items: [],
  };
  return projectData;
});

ipcMain.handle(
  'data:ingest-files',
  async (_event, files: { datasetI?: string; datasetII?: string }) => {
    console.log('Ingesting files...');

    try {
      const allItems: any[] = [];

      if (files.datasetI) {
        const parsed = parseCSVFile(files.datasetI);
        allItems.push(...parsed.items);
      }

      if (files.datasetII) {
        const parsed = parseCSVFile(files.datasetII);
        for (const item of parsed.items) {
          for (const quote of item.cotacoes) {
            quote.datasetFonte = 'PARAM_II_CONTRATACOES_SIMILARES';
          }
          const existing = allItems.find(
            (i) => i.numeroItem === item.numeroItem,
          );
          if (existing) {
            existing.cotacoes.push(...item.cotacoes);
          } else {
            allItems.push(item);
          }
        }
      }

      if (!projectData) {
        projectData = {
          id: uuidv4(),
          numeroProcesso: '138/2025',
          uasg: '420001',
          responsavel: 'João Silva',
          dataPesquisa: new Date().toISOString().split('T')[0],
          items: [],
        };
      }

      projectData.items = allItems;

      return {
        success: true,
        message: 'Files ingested successfully',
        project: projectData,
      };
    } catch (error) {
      console.error('Error ingesting files:', error);
      return {
        success: false,
        message: 'Error ingesting files: ' + String(error),
      };
    }
  },
);

ipcMain.handle('engine:run-saneamento', async (_event) => {
  console.log('Running saneamento engine');
  return { success: true, message: 'Sanitization complete (mock)' };
});

ipcMain.handle(
  'item:override-status',
  async (_event, { itemId, quoteId, newStatus, justification }) => {
    console.log('Override status:', {
      itemId,
      quoteId,
      newStatus,
      justification,
    });
    return { success: true };
  },
);

ipcMain.handle('export:generate-pdf', async (_event, data) => {
  console.log('Generating PDF:', data);
  return { success: true, path: '/tmp/nota-tecnica.pdf' };
});

ipcMain.handle('export:generate-excel', async (_event, data) => {
  console.log('Generating Excel:', data);
  return { success: true, path: '/tmp/memoria-calculo.xlsx' };
});

ipcMain.handle('get-project-data', async () => {
  return projectData;
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
