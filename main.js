const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('node:child_process');
require('dotenv').config();

const password = process.env.PASSWORD;
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

  ipcMain.on('command', (event, command, isSudo) => {
    const child = isSudo ? runSudoCommand(command) : runCommand(command);
    let dataOutput ;
    child.stdout.on('data', (data) => {
      dataOutput = data;
    });

    child.on('exit', (code, signal) =>{
      event.sender.send('response', 
        `Stdout:\n${dataOutput}\n` +
        'Child process exited with code ' + 
        `${code} and signal ${signal}`);
    });
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

function runSudoCommand(command) {
  const child = spawn('sudo', ['-S', 'sh', '-c', command]);
  child.stdin.write(password + '\n');
  child.stdin.end();
  return child;
}

function runCommand(command) {
  const child = spawn(command, {
    shell: true
  });
  return child;
}