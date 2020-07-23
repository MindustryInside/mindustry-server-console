const { BrowserWindow, shell, ipcMain } = require('electron');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { playerJoin, playerLeave } = require('../server-messages');

/**
 * Class for operating with Mindustry server.
 */
class Server extends EventEmitter {
    /**
     * Server.
     * @param options
     * @param options - Configuration options file.
     * @param options.rendererPath - Path to main .html file.
     * @param options.serverPath - Path to Mindustry server folder.
     */
    constructor(options) {
        super();
        this.serverPath = options.serverPath;
        this.configPath = path.join(this.serverPath, 'config');
        this.mapsPath = path.join(this.configPath, 'maps');
        this.modsPath = path.join(this.configPath, 'mods');

        this.loaded = false;

        this.start();
    }

    /**
     * Start .jar server file.
     */
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

    /**
     * Handle server events.
     */
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

    /**
     * Send a message to the window.
     * @param {string} event - A channel for sending.
     * @param {[*]} messages - Array of messages to be send.
     */
    sendToWindow(event, ...messages) {
        BrowserWindow.getAllWindows()[0].webContents.send(event, ...messages);
    }

    /**
     * Write a string to the server process.
     * @param {string} text - The text to be send.
     */
    write(text) {
        if (!this.serverProcess) throw new Error('Server isn\'t loaded!');
        this.serverProcess.stdin.write(text);
    }

    /**
     * Send a command to the server.
     * @param {string} text - The command to be send.
     */
    command(text) {
        this.write(`${text}\n`);
    }

    /**
     * Read a folder in the config.
     * @param {string} folder - Folder for reading.
     * @returns {Promise<[string]>} - Array with files in the folder.
     */
    readConfigFolder(folder) {
        return new Promise((resolve) => {
            fs.readdir(folder, (err, files) => {
                if (err) resolve([]);
                resolve(files);
            });
        });
    }

    /**
     * Get maps files in config/maps folder.
     * @returns {Promise<string[]>} - Array with files.
     */
    getMaps() {
        return this.readConfigFolder(this.mapsPath);
    }

    /**
     * Get mods files in config/mods folder.
     * @returns {Promise<string[]>} - Array with files.
     */
    getMods() {
        return this.readConfigFolder(this.modsPath);
    }

    /**
     * Open server/config folder.
     */
    openFolder() {
        shell.openExternal(path.join(this.serverPath, 'config'));
    }

    /**
     * Restart the server.
     */
    restart() {
        this.removeAllListeners();
        this.exit();
        this.start();
    }

    /**
     * Exit the server process.
     */
    exit() {
        this.serverProcess.kill();
        this.serverProcess = null;
    }
}

module.exports = Server;
