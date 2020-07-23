const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Class for creating server window.
 */
class ServerWindow {
    /**
     * Server window.
     * @param options
     */
    constructor(options) {
        this.rendererPath = options.rendererPath;

        this.createWindow();
        this.handleWindowEvents();
    }

    /**
     * Create a {@code BrowserWindow} instance.
     */
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

    /**
     * Handle window events.
     */
    handleWindowEvents() {
        this.browserWindow.webContents.once('did-finish-load', () => {
            this.browserWindow.show();
            this.browserWindow.focus();
        });
    }
}

module.exports = ServerWindow;
