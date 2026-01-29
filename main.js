const { app, BrowserWindow, ipcMain, shell, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const ws = require('windows-shortcuts');
const { extractIconWithPowerShell } = require('./icon-extractor');

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
  
  // Set app to launch at startup only in production (not in dev mode)
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: false,
      path: app.getPath('exe')
    });
  }
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
    let shortcutIcon = null;
    
    if (filePath.toLowerCase().endsWith('.lnk')) {
      const shortcutInfo = await new Promise((resolve, reject) => {
        ws.query(filePath, (err, result) => {
          if (err) {
            console.error('Error resolving shortcut:', err);
            resolve({ target: filePath, icon: null });
          } else if (result) {
            console.log('Resolved shortcut:', filePath, '->', result.target);
            resolve({
              target: result.target || filePath,
              icon: result.icon || null
            });
          } else {
            console.log('No target found in shortcut, using original path');
            resolve({ target: filePath, icon: null });
          }
        });
      });
      
      targetPath = shortcutInfo.target;
      shortcutIcon = shortcutInfo.icon;
    }
    
    console.log('Getting icon for target:', targetPath);
    
    if (shortcutIcon) {
      console.log('Shortcut has custom icon:', shortcutIcon);
      try {
        const psIcon = await extractIconWithPowerShell(shortcutIcon);
        if (psIcon) {
          console.log('Custom icon extracted with PowerShell');
          return psIcon;
        }
        
        const customIcon = await app.getFileIcon(shortcutIcon, { size: 'large' });
        if (customIcon && !customIcon.isEmpty()) {
          return customIcon.toDataURL();
        }
      } catch (iconErr) {
        console.log('Custom icon failed, continuing with target');
      }
    }
    
    if (targetPath.toLowerCase().endsWith('.exe')) {
      console.log('Trying PowerShell extraction for .exe file');
      const psIcon = await extractIconWithPowerShell(targetPath);
      if (psIcon) {
        console.log('Icon extracted successfully with PowerShell');
        return psIcon;
      }
    }
    
    const iconSizes = ['large', 'normal', 'small'];
    
    for (const size of iconSizes) {
      try {
        const icon = await app.getFileIcon(targetPath, { size: size });
        if (icon && !icon.isEmpty()) {
          console.log(`Icon extracted successfully with size: ${size}`);
          return icon.toDataURL();
        }
      } catch (err) {
        console.log(`Failed to get icon with size ${size}:`, err.message);
      }
    }
    
    if (filePath !== targetPath) {
      console.log('Trying original shortcut path');
      
      if (filePath.toLowerCase().endsWith('.lnk')) {
        const psIcon = await extractIconWithPowerShell(filePath);
        if (psIcon) {
          console.log('Shortcut icon extracted with PowerShell');
          return psIcon;
        }
      }
      
      for (const size of iconSizes) {
        try {
          const icon = await app.getFileIcon(filePath, { size: size });
          if (icon && !icon.isEmpty()) {
            console.log(`Icon extracted from shortcut with size: ${size}`);
            return icon.toDataURL();
          }
        } catch (err) {
          console.log(`Failed to get shortcut icon with size ${size}`);
        }
      }
    }
    
    console.error('All icon extraction methods failed for:', filePath);
    return null;
  } catch (err) {
    console.error('Error getting icon for:', filePath, err);
    return null;
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
