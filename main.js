const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('node:child_process');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });


  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('command', (event, command) => {
    runCommand(command);
    const response = `Response for the command: ${command}`;
    event.sender.send('response', response);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function runCommand(command) {

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Resultado: ${stdout}`);
  });
}