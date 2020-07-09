const { BrowserWindow, shell, ipcMain } = require('electron');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const path = require('path');

class Server extends EventEmitter {
    constructor(options) {
        super();
        this.serverPath = options.serverPath;
        this.loaded = false;

        this.start();
    }

    start() {
        if (this.loaded) throw new Error('Server already running!');

        this.handleEvents();
        this.serverProcess = spawn('java', ['-jar', 'server.jar'], { cwd: this.serverPath });
        this.serverProcess.stdout.on('data', (buffer) => {
            if (!buffer) return;
            const data = buffer.toString().split(' ').slice(3).join(' ');

            this.emit('output', data);
        });
    }

    handleEvents() {
        ipcMain.on('command', (event, args) => this.command(args));
        ipcMain.on('restart', () => this.restart());
        ipcMain.on('openFolder', () => this.openFolder());

        this.on('output', (message) => {
            BrowserWindow.getAllWindows()[0].webContents.send('output', message);
            if (message.includes('connected')) {
                this.emit('playerConnect', message.split(' ')[2]);
            }

            if (message.includes('disconnected')) {
                this.emit('playerDisconnect', message.split(' ')[2]);
            }
        });

        this.on('playerConnect', (player) => {
            BrowserWindow.getAllWindows()[0].webContents.send('playerConnect', player);
        });

        this.on('playerDisconnect', (player) => {
            BrowserWindow.getAllWindows()[0].webContents.send('playerDisconnect', player);
        });
    }

    write(text) {
        if (!this.serverProcess) throw new Error('Server not loaded!');
        this.serverProcess.stdin.write(text);
    }

    command(text) {
        this.write(`${text}\n`);
    }

    openFolder() {
        shell.openExternal(path.join(this.serverPath, 'config'));
    }

    restart() {
        this.removeAllListeners();
        this.exit();
        this.start();
    }

    exit() {
        this.serverProcess.kill();
        this.serverProcess = null;
    }
}

module.exports = Server;
