const path = require('path');
const { BrowserWindow } = require('electron');

class ServerWindow {
    constructor(options) {
        this.rendererPath = options.rendererPath;

        this.createWindow();
        this.handleWindowEvents();
    }

    createWindow() {
        this.browserWindow = new BrowserWindow({
            height: 583,
            width: 1038,

            show: false,
            frame: false,

            backgroundColor: '#0c0c0c',
            icon: path.resolve(__dirname, '..', '..', 'resources', 'icon_64.png'),

            webPreferences: {
                nodeIntegration: true,
            },
        });

        this.browserWindow.loadFile(this.rendererPath);
    }

    handleWindowEvents() {
        this.browserWindow.webContents.once('did-finish-load', () => {
            this.browserWindow.show();
            this.browserWindow.focus();
        });
    }
}

module.exports = ServerWindow;
