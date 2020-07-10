const { globalShortcut, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

const Titlebar = require('./titlebar');
const Players = require('./players');
const Translations = require('./translations');
const ColorSwitcher = require('./color-switcher');
const Menu = require('./menu');

class Console {
    constructor() {
        this.titlebar = new Titlebar();
        this.menu = new Menu();
        this.players = new Players();
        this.translations = new Translations();
        this.colorSwitcher = new ColorSwitcher();

        this.logElement = document.getElementById('console-log');
        this.inputElement = document.getElementById('console-input');

        this.lastCommands = [];
        this.lastCommandsState = 0;
        this.customCommands = {};

        this.setup();
    }

    setup() {
        this.setupKeybinds();
        ipcRenderer.on('output', (event, args) => {
            // TODO: Colored chat
            this.logMessage(args);
        });

        this.inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const customCommand = this.customCommands[this.inputElement.value];
                if (customCommand) {
                    customCommand();
                } else {
                    const command = this.inputElement.value;
                    ipcRenderer.send('command', command);
                }

                this.lastCommands.push(this.inputElement.value);
                this.lastCommandsState += 1;
                this.clearInput();
            }

            if (event.key === 'ArrowUp') {
                if (!this.lastCommands[this.lastCommandsState - 1]) return;
                this.lastCommandsState -= 1;
                this.inputElement.value = this.lastCommands[this.lastCommandsState];
            }

            if (event.key === 'ArrowDown') {
                if (!this.lastCommands[this.lastCommandsState + 1]) return;
                this.lastCommandsState += 1;
                this.inputElement.value = this.lastCommands[this.lastCommandsState];
            }
        });

        this.addCommand('clear', () => this.clearLog());
        this.addCommand('exit', () => this.exit());
    }

    setupKeybinds() {
        this.addKeybind('Escape', () => this.exit());
        this.addKeybind('F1', () => this.nextColor());
        this.addKeybind('F2', () => this.nextLang());
        this.addKeybind('F3', () => {
            const currentWindow = getCurrentWindow();
            if (currentWindow.webContents.isDevToolsOpened()) {
                currentWindow.webContents.closeDevTools();
            } else {
                currentWindow.webContents.openDevTools();
            }
        });

        this.addCtrlKeybind('r', () => this.restart());
        this.addCtrlKeybind('e', () => this.exit());
    }

    restart() {
        this.clearLog();
        ipcRenderer.send('restart');
    }

    setColor(color) {
        this.colorSwitcher.setColor(color);
    }

    nextColor() {
        this.colorSwitcher.nextColor();
    }

    setLang(language) {
        this.translations.setLang(language);
    }

    nextLang() {
        this.translations.nextLang();
    }

    addKeybind(key, listener) {
        globalShortcut.register(key, listener);
    }

    addCtrlKeybind(key, listener) {
        this.addKeybind(`CommandOrControl+${key}`, listener);
    }

    addCommand(command, listener) {
        this.customCommands[command] = listener;
    }

    getPlayers() {
        return this.players.getPlayers();
    }

    clearInput() {
        this.inputElement.value = '';
        this.lastCommandsState = this.lastCommands.length;
    }

    clearLog() {
        this.logElement.innerText = '';
    }

    logMessage(message) {
        this.logElement.insertAdjacentHTML('beforeend', `${message}<br>`);
        this.scrollDown();
    }

    scrollDown() {
        window.scrollTo(0, document.scrollingElement.scrollHeight);
    }

    exit() {
        ipcRenderer.send('exit');
    }
}

module.exports = Console;
