const { app, BrowserWindow, ipcMain, shell, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const ws = require('windows-shortcuts');

let mainWindow;
let tray = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  const windowHeight = 300;
  const yPosition = Math.floor((height - windowHeight) / 2);

  mainWindow = new BrowserWindow({
    width: 380,
    height: windowHeight,
    x: width - 380,
    y: yPosition,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      offscreen: false
    }
  });
  
  mainWindow.setIgnoreMouseEvents(false);

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  // Set app to launch at startup
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    path: app.getPath('exe')
  });
});

function createTray() {
  // Load the custom icon
  const iconPath = path.join(__dirname, 'icon.ico');
  const icon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Sidebar',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Hide Sidebar',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Windows 11 Sidebar');
  tray.setContextMenu(contextMenu);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('open-path', (event, filePath) => {
  shell.openPath(filePath).catch(err => {
    console.error('Error opening path:', err);
  });
});

ipcMain.handle('get-file-icon', async (event, filePath) => {
  try {
    let targetPath = filePath;
    
    if (filePath.toLowerCase().endsWith('.lnk')) {
      targetPath = await new Promise((resolve, reject) => {
        ws.query(filePath, (err, result) => {
          if (err) {
            console.error('Error resolving shortcut:', err);
            resolve(filePath);
          } else if (result && result.target) {
            console.log('Resolved shortcut:', filePath, '->', result.target);
            resolve(result.target);
          } else {
            console.log('No target found in shortcut, using original path');
            resolve(filePath);
          }
        });
      });
    }
    
    console.log('Getting icon for target:', targetPath);
    const icon = await app.getFileIcon(targetPath, { size: 'large' });
    
    if (!icon || icon.isEmpty()) {
      console.log('Icon is empty, trying original path');
      const fallbackIcon = await app.getFileIcon(filePath, { size: 'large' });
      return fallbackIcon.toDataURL();
    }
    
    return icon.toDataURL();
  } catch (err) {
    console.error('Error getting icon for:', filePath, err);
    try {
      const fallbackIcon = await app.getFileIcon(filePath, { size: 'normal' });
      return fallbackIcon.toDataURL();
    } catch (fallbackErr) {
      console.error('Fallback icon also failed:', fallbackErr);
      return null;
    }
  }
});


ipcMain.on('resize-window', (event, newHeight) => {
  if (mainWindow) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const yPosition = Math.floor((height - newHeight) / 2);
    
    mainWindow.setBounds({
      x: width - 380,
      y: yPosition,
      width: 380,
      height: newHeight
    });
  }
});
