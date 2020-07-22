const { BrowserWindow, shell, ipcMain } = require('electron');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { playerJoin, playerLeave } = require('../server-messages');

class Server extends EventEmitter {
    constructor(options) {
        super();
        this.serverPath = options.serverPath;
        this.configPath = path.join(this.serverPath, 'config');
        this.mapsPath = path.join(this.configPath, 'maps');
        this.modsPath = path.join(this.configPath, 'mods');

        this.loaded = false;

        this.start();
    }

    start() {
        if (this.loaded) throw new Error('Server is already running!');

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

        ipcMain.on('maps', async (event) => {
            // eslint-disable-next-line no-param-reassign
            event.returnValue = await this.getMaps();
        });

        ipcMain.on('mods', async (event) => {
            // eslint-disable-next-line no-param-reassign
            event.returnValue = await this.getMods();
        });

        this.on('output', (message) => {
            this.sendToWindow('output', message);

            if (playerJoin(message)) {
                this.emit('playerJoin', message.split(' ')[2]);
            } else if (playerLeave(message)) {
                this.emit('playerLeave', message.split(' ')[2]);
            }
        });

        this.on('playerJoin', (player) => {
            this.sendToWindow('playerJoin', player);
        });

        this.on('playerLeave', (player) => {
            this.sendToWindow('playerLeave', player);
        });
    }

    sendToWindow(event, ...messages) {
        BrowserWindow.getAllWindows()[0].webContents.send(event, ...messages);
    }

    write(text) {
        if (!this.serverProcess) throw new Error('Server isn\'t loaded!');
        this.serverProcess.stdin.write(text);
    }

    command(text) {
        this.write(`${text}\n`);
    }

    readConfigFolder(folder) {
        return new Promise((resolve) => {
            fs.readdir(folder, (err, files) => {
                if (err) resolve([]);
                resolve(files);
            });
        });
    }

    getMaps() {
        return this.readConfigFolder(this.mapsPath);
    }

    getMods() {
        return this.readConfigFolder(this.modsPath);
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
