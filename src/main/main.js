const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const database = require('../database/database');

// IPC handlers for database
ipcMain.handle('database-query', async (event, sql, params) => {
    return new Promise((resolve, reject) => {
        database.db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('database-run', async (event, sql, params) => {
    return new Promise((resolve, reject) => {
        database.db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
});

// CORRECTED: Use the right method name for Electron 28
ipcMain.handle('show-input-dialog', async (event, options) => {
    console.log("show-input-dialog called with:", options);
    
    try {
        // In Electron 28, we need to use showMessageBox with the input option
        const result = await dialog.showMessageBox({
            type: 'question',
            buttons: ['OK', 'Cancel'],
            defaultId: 0,
            title: options.title || 'Input',
            message: options.message || 'Please enter:',
            detail: options.detail,
            input: true,
            inputPlaceholder: options.placeholder || 'Enter text here...'
        });
        
        console.log("Full dialog result:", result);
        
        // The input value should be in result.input
        if (result.response === 0) { // OK clicked
            console.log("User entered:", result.input);
            return result.input || ''; // Return empty string if undefined
        }
        
        console.log("Dialog cancelled");
        return null;
        
    } catch (error) {
        console.error("Dialog error:", error);
        throw error;
    }
});

ipcMain.handle('show-alert-dialog', async (event, options) => {
    await dialog.showMessageBox({
        type: 'info',
        title: options.title || 'Alert',
        message: options.message,
        detail: options.detail
    });
});

async function createMainWindow() {
    // Initialize database first
    await database.connect();
    
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('src/renderer/index.html');
    
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
