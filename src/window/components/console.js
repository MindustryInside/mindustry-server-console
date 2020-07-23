const { getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

const Titlebar = require('./ui/titlebar');
const Menu = require('./ui/menu');
const Players = require('./ui/players');
const Keybinds = require('./keybinds');
const Translations = require('./translations');
const ColorSwitcher = require('./color-switcher');

/**
 * Main renderer side class.
 */
class Console {
    /**
     * Console.
     */
    constructor() {
        this.titlebar = new Titlebar();
        this.menu = new Menu();
        this.players = new Players();
        this.keybinds = new Keybinds();
        this.translations = new Translations();
        this.colorSwitcher = new ColorSwitcher();

        this.logElement = document.getElementById('console-log');
        this.inputElement = document.getElementById('console-input');

        this.lastCommands = [];
        this.lastCommandsState = 0;
        this.customCommands = {};

        this.setup();
    }

    /**
     * Setup console.
     */
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

    /**
     * Setup all keybinds for console.
     */
    setupKeybinds() {
        this.addKeybind('Escape', () => this.exit());
        this.addKeybind('F1', () => this.switchColor());
        this.addKeybind('F2', () => this.switchLang());
        this.addKeybind('F12', () => this.switchDevTools());

        this.addCtrlKeybind('r', () => this.restart());
        this.addCtrlKeybind('e', () => this.exit());
    }


    /**
     * Restart the console.
     */
    restart() {
        this.clearLog();
        ipcRenderer.send('restart');
    }

    /**
     * Switch Chrome Dev Tools; Enabled / Disabled.
     */
    switchDevTools() {
        const currentWindow = getCurrentWindow();
        if (currentWindow.webContents.isDevToolsOpened()) {
            currentWindow.webContents.closeDevTools();
        } else {
            currentWindow.webContents.openDevTools();
        }
    }

    /**
     * Switch to the next console color.
     */
    switchColor() {
        this.colorSwitcher.nextColor();
    }

    /**
     * Switch to the next console language.
     */
    switchLang() {
        this.translations.nextLang();
    }

    /**
     * Add console keybind.
     * @param {string} key - Keyboard key.
     * @param {function} listener - Listener for button clicked.
     */
    addKeybind(key, listener) {
        this.keybinds.add(key, listener);
    }

    /**
     * Add console keybind with Control (Command on Mac) key.
     * @param {string} key - Keyboard key.
     * @param {function} listener - Listener for button clicked.
     */
    addCtrlKeybind(key, listener) {
        this.keybinds.addCtrl(key, listener);
    }

    /**
     * Add custom server command.
     * @param {string} command - Command name.
     * @param {function} listener - Listener for command.
     */
    addCommand(command, listener) {
        this.customCommands[command] = listener;
    }

    /**
     * Clear command line text.
     */
    clearInput() {
        this.inputElement.value = '';
        this.lastCommandsState = this.lastCommands.length;
    }

    /**
     * Clear console log.
     */
    clearLog() {
        this.logElement.innerText = '';
    }

    /**
     * Log message to the console log.
     * @param {string} message - Message to be sent.
     */
    logMessage(message) {
        this.logElement.insertAdjacentHTML('beforeend', `${message}<br>`);
        this.scrollDown();
    }

    /**
     * Scroll down to console.
     */
    scrollDown() {
        window.scrollTo(0, document.scrollingElement.scrollHeight);
    }

    /**
     * Exit the console.
     */
    exit() {
        ipcRenderer.send('exit');
    }
}

module.exports = Console;
